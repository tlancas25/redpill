const admin = require('firebase-admin');

// Ensure you set GOOGLE_APPLICATION_CREDENTIALS
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS');
  process.exit(1);
}

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'redpillreader-249ec'
    });
}

const db = admin.firestore();

// Fetch the very first user (since there is only one)
async function assignAllProductsToFirstUser() {
  try {
    const usersSnapshot = await db.collection('users').limit(1).get();
    
    if (usersSnapshot.empty) {
        console.log('No users found to assign products to.');
        process.exit(0);
    }
    
    const userDoc = usersSnapshot.docs[0];
    const userId = userDoc.id;
    console.log(`Found test user: ${userDoc.data().email} (ID: ${userId})`);
    
    const productsSnapshot = await db.collection('products').get();
    const productIds = productsSnapshot.docs.map(doc => doc.id);
    
    console.log(`Found ${productIds.length} products:`, productIds);
    
    await db.collection('users').doc(userId).update({
        purchasedProducts: productIds
    });
    
    console.log(`✅ Successfully assigned all ${productIds.length} products to user ${userDoc.data().email}!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignAllProductsToFirstUser();