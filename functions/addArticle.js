const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');
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
    console.log('Raw event body:', event.body);
    const { title, content, date, category, archiveOld = false } = JSON.parse(event.body);
    console.log('Parsed content:', content);

    const validCategories = ['home', 'economic', 'growth', 'tech', 'about'];
    if (!validCategories.includes(category)) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid category' }) };
    }

    const docRef = await addDoc(collection(db, 'articles'), { title, content, date, category, archived: false });
    console.log('Added article ID:', docRef.id);

    const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
    const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email);
    console.log('Subscribers:', subscribers);
    await notify.handler({ body: JSON.stringify({ subscribers, title, content }) });

    return { statusCode: 200, body: JSON.stringify({ message: 'Article added and subscribers notified' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};