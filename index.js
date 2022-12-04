require('dotenv').config();
const { Client } = require('pg');

exports.handler = async (event) => {
  // console.log('@@@ Received event:', JSON.stringify(event, null, 2));
  console.log('@@@ Received event.path:', event.path);
  console.log('@@@ Received event.httpMethod:', event.httpMethod);
  console.log('@@@ Received event.queryStringParameters:', JSON.stringify(event.queryStringParameters, null, 2));
  console.log('@@@ Received event.body:', event.body);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: '',
    }
  };
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect((error) => {
      if (error) {
        throw error;
      }
    });

    switch (`${event.path}_${event.httpMethod}`) {
      case '/note-list_GET':
        const query = 'select * from note_list';
  
        const result = await client.query(query);
        response.statusCode = 200;
        response.body.result = result.rows;
        break;
      default:
        console.warn('not matched!!');
    }
  } catch(error) {
    console.error(error);

    response.statusCode = 500;
    response.body.message = '요청 처리에 실패했습니다.';
  } finally {
    console.log('@@@ done lambda!!');
    await client.end();
    response.body = JSON.stringify(response.body);
  }
  
  return response;
};
