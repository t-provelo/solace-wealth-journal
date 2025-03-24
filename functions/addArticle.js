const Database = require('better-sqlite3');
const path = require('path');
const notify = require('./notify');

exports.handler = async (event) => {
  const db = new Database(path.join(__dirname, 'articles.db'));
  const { title, content, date } = JSON.parse(event.body);

  db.exec(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT
  )`);

  db.prepare(`INSERT INTO articles (title, content, date) VALUES (?, ?, ?)`).run(title, content, date);

  const subscribers = db.prepare(`SELECT email FROM subscribers`).all();
  db.close();

  await notify.handler({ body: JSON.stringify({ subscribers: subscribers.map(s => s.email), title, content }) });
  return { statusCode: 200, body: JSON.stringify({ message: 'Article added and subscribers notified' }) };
};