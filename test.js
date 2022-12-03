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

// const query = 'select now()';
const query = 'select * from note_list';

client.query(query, (err, res) => {
  if (err) {
    console.log(err.stack);
    // console.log(err);
    return;
  }

  console.log(res.rows);
  
  client.end();
});