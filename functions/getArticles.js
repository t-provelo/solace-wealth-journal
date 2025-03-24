const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, orderBy } = require('firebase/firestore');

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
  const { category } = JSON.parse(event.body || '{}');
  console.log('Fetching articles for category:', category);
  const articlesQuery = query(
    collection(db, 'articles'),
    where('archived', '==', false),
    category ? where('category', '==', category) : null,
    orderBy('date', 'desc')
  ).withConverter({
    toFirestore: (data) => data,
    fromFirestore: (snapshot) => ({ id: snapshot.id, ...snapshot.data() })
  });

  const articlesSnapshot = await getDocs(articlesQuery);
  const articles = articlesSnapshot.docs.map(doc => doc.data());
  console.log('Articles fetched:', articles);

  return { statusCode: 200, body: JSON.stringify(articles) };
};