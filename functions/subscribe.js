const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, addDoc } = require('firebase/firestore');

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
  const { email } = JSON.parse(event.body);

  const subscribersRef = collection(db, 'subscribers');
  const q = query(subscribersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return { statusCode: 200, body: JSON.stringify({ message: 'Already subscribed' }) };
  }

  await addDoc(subscribersRef, { email });
  return { statusCode: 200, body: JSON.stringify({ message: 'Subscribed' }) };
};