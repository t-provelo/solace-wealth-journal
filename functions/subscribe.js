const Database = require('better-sqlite3');
const path = require('path');

exports.handler = async (event) => {
  const db = new Database(path.join(__dirname, 'articles.db'));
  const { email } = JSON.parse(event.body);

  // Create table if it doesn’t exist
  db.exec(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE
  )`);

  // Check if email exists
  const exists = db.prepare(`SELECT email FROM subscribers WHERE email = ?`).get(email);
  if (exists) {
    db.close();
    return { statusCode: 200, body: JSON.stringify({ message: 'Already subscribed' }) };
  }

  // Insert new email
  db.prepare(`INSERT INTO subscribers (email) VALUES (?)`).run(email);
  db.close();
  return { statusCode: 200, body: JSON.stringify({ message: 'Subscribed' }) };
};