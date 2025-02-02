import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB

  },
});
export default db;