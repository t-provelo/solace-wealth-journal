const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

const addArticle = require('./functions/addArticle');
const subscribe = require('./functions/subscribe');
const notify = require('./functions/notify');
const getArticles = require('./functions/getArticles');

const adaptHandler = (handler) => {
  return (req, res) => {
    const event = {
      body: JSON.stringify(req.body),
      headers: req.headers,
      method: req.method
    };
    const context = {};
    
    handler(event, context)
      .then(response => {
        res.status(response.statusCode).json(JSON.parse(response.body));
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  };
};

app.use('/.netlify/functions/addArticle', adaptHandler(addArticle.handler));
app.use('/.netlify/functions/subscribe', adaptHandler(subscribe.handler));
app.use('/.netlify/functions/notify', adaptHandler(notify.handler));
app.use('/.netlify/functions/getArticles', adaptHandler(getArticles.handler));

app.listen(3000, () => console.log('Test server on port 3000'));