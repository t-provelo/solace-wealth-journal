const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');

exports.handler = async (event) => {
  const db = new sqlite3.Database(path.join(__dirname, 'articles.db')); // Fixed path
  const { title, content, date } = JSON.parse(event.body);

  await new Promise((resolve) => {
    db.run(`CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      date TEXT
    )`, resolve);
  });

  await new Promise((resolve, reject) => {
    db.run(`INSERT INTO articles (title, content, date) VALUES (?, ?, ?)`,
      [title, content, date],
      (err) => {
        if (err) reject(err);
        else resolve();
      });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tennardxterry@gmail.com',
      pass: 'gqzjubheasecdyho'
    }
  });

  const subscribers = await new Promise((resolve) => {
    db.all(`SELECT email FROM subscribers`, (err, rows) => {
      if (err) resolve([]);
      resolve(rows);
    });
  });

  const mailOptions = {
    from: 'tennardxterry@gmail.com',
    subject: `New Article: ${title}`,
    text: `Check out the new article at https://theroycollection.com!`
  };

  try {
    await Promise.all(subscribers.map(sub => 
      transporter.sendMail({ ...mailOptions, to: sub.email })
    ));
  } catch (error) {
    console.error('Notification failed:', error.message);
  }

  db.close();
  return { statusCode: 201, body: JSON.stringify({ message: 'Article added and subscribers notified' }) };
};