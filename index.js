require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

client.connect();

exports.handler = async (event) => {
  console.log('@@@ Received event:', JSON.stringify(event, null, 2));
  const response = {
    statusCode: 500,
    body: {
      message: '',
    }
  }
  
  switch (`${event.path}_${event.httpMethod}`) {
    case '/notepad/test_GET':
      const query = 'select * from note_list';

      client.query(query, (err, res) => {
        if (err) {
          console.log(err.stack);
          // console.log(err);
          return;
        }
        
        response.statusCode = 200;
        response.body.result = res.rows;
      
        client.end();
      });
      break;
    default:
      response.body.message = '요청 처리에 실패했습니다.';
  }
  
  return response;
};
