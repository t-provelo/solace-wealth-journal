const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

exports.handler = async (event) => {
  const db = new sqlite3.Database(path.join(__dirname, 'articles.db')); // Fixed path
  const { title } = JSON.parse(event.body);

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
    db.close();
    return { statusCode: 200, body: JSON.stringify({ message: 'Notified subscribers' }) };
  } catch (error) {
    db.close();
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};