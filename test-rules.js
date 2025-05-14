const { initializeTestEnvironment } = require('@firebase/rules-unit-testing');
const { getFirestore } = require('firebase/firestore');

async function testRules() {
  // Initialize test environment
  const testEnv = await initializeTestEnvironment({
    projectId: 'roy-collection-6d136',
    firestore: {
      host: 'localhost:8080',
      port: 8080,
      rules: require('fs').readFileSync('firestore.rules', 'utf8'),
    },
  });

  // Clear Firestore data before tests
  await testEnv.clearFirestore();

  // Test unauthenticated access
  const unauthDb = testEnv.unauthenticatedContext().firestore();

  // Test read
  try {
    const snapshot = await unauthDb.collection('articles').get();
    console.log('Read allowed:', snapshot.docs.map(doc => doc.data()));
  } catch (e) {
    console.error('Read failed:', e);
  }

  // Test write
  try {
    await unauthDb.collection('articles').add({ test: 'data' });
    console.log('Write allowed');
  } catch (e) {
    console.error('Write failed:', e);
  }

  // Cleanup
  await testEnv.cleanup();
}

testRules().catch(console.error);