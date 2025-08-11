import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

// Check if DATABASE_URL is available (Supabase connection string)
const connection = process.env.DATABASE_URL 
  ? process.env.DATABASE_URL
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PSWD,
      database: process.env.DB,
      port: process.env.DB_PORT || 5432,
      ssl: {
        rejectUnauthorized: false // Required for Supabase
      }
    };

const db = knex({
  client: 'pg',
  connection,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
});

// Test the connection with better error handling
db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully');
    console.log('🔗 Connection type:', process.env.DATABASE_URL ? 'DATABASE_URL' : 'Individual credentials');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Connection details:', {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasIndividualCreds: !!(process.env.DB_HOST && process.env.DB_USER)
    });
  });

export default db;