const { Pool } = require('pg');

// Replace 'username', 'password', 'host', 'port', and 'database' with your actual database credentials
const pool = new Pool({
  user: 'postgres',
  password: 'root',
  host: '127.0.0.1',
  port: 5432,
  database: 'qbb',
});

  
  module.exports = pool
