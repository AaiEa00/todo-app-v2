import pg from 'pg';

// pg reads PGHOST, PGPORT, PGUSER, PGPASSWORD and PGDATABASE from .env.
const client = new pg.Client({ connectionTimeoutMillis: 5000 });

try {
    await client.connect();
    const result = await client.query('SELECT 1 AS connection_ok');
    if (result.rows[0]?.connection_ok !== 1) {
        throw new Error('Unexpected database response');
    }
    console.log('PostgreSQL connection OK (SELECT 1 = 1)');
} catch (error) {
    console.error('PostgreSQL connection failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
} finally {
    await client.end();
}
