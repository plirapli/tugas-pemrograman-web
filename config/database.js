require('dotenv').config();
const mysql = require('mysql2');

const config = {
  host: process.env.HOST || 'localhost',
  user: process.env.USER || 'root',
  password: process.env.PASSWORD || '',
  database: process.env.DATABASE || 'nwind',
};

const connect = mysql.createConnection(config);

// Koneksi DB
connect.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});

module.exports = connect;
