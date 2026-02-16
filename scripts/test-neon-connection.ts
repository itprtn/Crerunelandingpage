/**
 * Test Neon Database Connection
 * Vérifie que la connexion à Neon fonctionne et que le schéma est en place
 */

import { Pool } from 'pg';

async function testNeonConnection() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KPsQzMwm07tj@ep-muddy-base-aenbm79t-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('[Neon Test] Connecting to database...');
    const client = await pool.connect();
    
    console.log('✅ [Neon] Connected successfully!');

    // Test 1: Check database version
    const versionResult = await client.query('SELECT version()');
    console.log('[Neon] PostgreSQL Version:', versionResult.rows[0].version.split(',')[0]);

    // Test 2: List all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('\n[Neon] Tables in database:');
    tablesResult.rows.forEach((row: any) => {
      console.log(`  ✓ ${row.table_name}`);
    });

    // Test 3: Count rows in each table
    console.log('\n[Neon] Row counts:');
    for (const table of tablesResult.rows) {
      const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table.table_name}`);
      console.log(`  - ${table.table_name}: ${countResult.rows[0].count} rows`);
    }

    // Test 4: Check settings
    const settingsResult = await client.query('SELECT key, value FROM app_settings LIMIT 5');
    if (settingsResult.rows.length > 0) {
      console.log('\n[Neon] Sample settings:');
      settingsResult.rows.forEach((row: any) => {
        console.log(`  - ${row.key}: ${JSON.stringify(row.value)}`);
      });
    }

    console.log('\n✅ All tests passed!');
    client.release();
  } catch (error) {
    console.error('❌ [Neon] Connection error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testNeonConnection();
