const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

let dbPromise;

async function setupDB() {
  const dbPath = path.join(__dirname, 'database.sqlite');
  
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys for SQLite
  await db.exec('PRAGMA foreign_keys = ON;');

  // Run schema to create tables if they don't exist
  const schemaPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await db.exec(schemaSql);
  }

  // Safely add columns for the auto-delete feature and the new role partition logic
  try {
    const tableUpdates = [
      'ALTER TABLE complaints ADD COLUMN resolved_at DATETIME;',
      'ALTER TABLE users ADD COLUMN batch TEXT;',
      'ALTER TABLE users ADD COLUMN department TEXT;',
      'ALTER TABLE users ADD COLUMN admin_type TEXT;',
      'ALTER TABLE complaints ADD COLUMN category TEXT DEFAULT \'College\' ;',
      'ALTER TABLE complaints ADD COLUMN priority TEXT DEFAULT \'Medium\' ;',
      'ALTER TABLE complaints ADD COLUMN incident_date TEXT ;'
    ];
    for (const stmt of tableUpdates) {
      try { await db.exec(stmt); } catch (e) { /* Ignore existing col errors */ }
    }
  } catch (e) {}

  // Cleanup task: Auto delete resolved complaints older than 30 days
  const cleanup = async () => {
    try {
      await db.run("DELETE FROM complaints WHERE status = 'Resolved' AND resolved_at IS NOT NULL AND datetime(resolved_at) <= datetime('now', '-30 days')");
    } catch(e) {
      console.error('Database cleanup error:', e);
    }
  };
  cleanup(); // run right away on startup
  setInterval(cleanup, 1000 * 60 * 60 * 24); // and run daily
  
  
  console.log('Connected to SQLite database successfully');
  return db;
}

// Export a proxy object representing the database connection that mimics mysql2 API
const dbWrapper = {
  async query(sql, params) {
    if (!dbPromise) dbPromise = setupDB();
    const db = await dbPromise;
    
    const upperSql = sql.trim().toUpperCase();
    if (upperSql.startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows]; // Wrap in array to match mysql2 array restructuring [rows, fields]
    } else {
      const result = await db.run(sql, params);
      // Mock mysql2 result object insertion data
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

module.exports = dbWrapper;
