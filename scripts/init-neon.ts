import { createPool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

async function initNeonDatabase() {
  const connectionString = 'postgresql://neondb_owner:npg_KPsQzMwm07tj@ep-muddy-base-aenbm79t-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

  const pool = createPool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('[Neon] Connecting to database...');
    const client = await pool.connect();
    
    // Read the SQL file
    const sqlFilePath = path.resolve('./scripts/01-init-neon.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');
    
    console.log('[Neon] Executing schema setup...');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      try {
        console.log(`[Neon] Executing: ${statement.substring(0, 60)}...`);
        await client.query(statement);
      } catch (error) {
        console.error(`[Neon] Error in statement: ${error.message}`);
      }
    }
    
    console.log('[Neon] ✅ Database initialization complete!');
    client.release();
  } catch (error) {
    console.error('[Neon] ❌ Connection error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initNeonDatabase();
