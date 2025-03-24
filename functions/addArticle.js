const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc } = require('firebase/firestore');
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
  const { title, content, date } = JSON.parse(event.body);

  await addDoc(collection(db, 'articles'), { title, content, date });

  const subscribersSnapshot = await getDocs(collection(db, 'subscribers'));
  const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email);

  await notify.handler({ body: JSON.stringify({ subscribers, title, content }) });
  return { statusCode: 200, body: JSON.stringify({ message: 'Article added and subscribers notified' }) };
};