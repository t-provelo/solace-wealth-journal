const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');
const notify = require('./notify');

const firebaseConfig = {
  apiKey: "AIzaSyDCgmDCNY4VOnZyKdZQGvfnTlULzcBRMXU",
  authDomain: "roy-collection-6d136.firebaseapp.com",
  projectId: "roy-collection-6d136",
  storageBucket: "roy-collection-6d136.firebasestorage.app",
  messagingSenderId: "539781423883",
  appId: "1:539781423883:web:2d67d4dcc1cc0d94a9780e",
  measurementId: "G-HNHC911W9D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

exports.handler = async (event) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-03-25"
    console.log('Checking articles for date:', today);

    const articlesQuery = query(
      collection(db, 'articles'),
      where('date', '==', today),
      where('archived', '==', false),
      orderBy('date', 'desc')
    );
    const articlesSnapshot = await getDocs(articlesQuery);
    const newArticles = articlesSnapshot.docs.map(doc => doc.data());

    if (newArticles.length === 0) {
      return { statusCode: 200, body: JSON.stringify({ message: 'No new articles today' }) };
    }

    const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
    const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email);

    for (const article of newArticles) {
      await notify.handler({
        body: JSON.stringify({
          subscribers,
          title: article.title,
          content: article.content
        })
      });
    }

    return { statusCode: 200, body: JSON.stringify({ message: 'Notifications sent for new articles' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};