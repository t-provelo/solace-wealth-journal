const sqlite3 = require('sqlite3').verbose();
const path = require('path');

exports.handler = async (event) => {
  const db = new sqlite3.Database(path.join(__dirname, 'articles.db'));
  const { email } = JSON.parse(event.body);

  // Create table if it doesn’t exist
  await new Promise((resolve) => {
    db.run(`CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE
    )`, resolve);
  });

  // Check if email already exists
  const exists = await new Promise((resolve) => {
    db.get(`SELECT email FROM subscribers WHERE email = ?`, [email], (err, row) => {
      resolve(!!row); // True if email exists, false if not
    });
  });

  if (exists) {
    db.close();
    return { statusCode: 200, body: JSON.stringify({ message: 'Already subscribed' }) };
  }

  // Insert new email
  return new Promise((resolve) => {
    db.run(`INSERT INTO subscribers (email) VALUES (?)`, [email], (err) => {
      db.close();
      if (err) return resolve({ statusCode: 500, body: JSON.stringify({ error: err.message }) });
      resolve({ statusCode: 200, body: JSON.stringify({ message: 'Subscribed' }) });
    });
  });
};