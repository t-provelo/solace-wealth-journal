const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Parse request body
    const { title, content, date, category, archived } = JSON.parse(event.body);

    // Validate input
    if (!title || !content || !date || !category) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Add article to Firestore
    const articleRef = await db.collection('articles').add({
      title,
      content,
      date,
      category,
      archived: archived || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Article added successfully', id: articleRef.id }),
    };
  } catch (error) {
    console.error('Error adding article:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};