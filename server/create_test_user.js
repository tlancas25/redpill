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

async function createAndAssignUser() {
  const testEmail = 'testuser@redpillreader.com';
  const testPassword = 'Password123!';
  const testName = 'Test User';
  let uid = '';

  try {
    // 1. Check if user already exists in Firebase Auth
    console.log(`Checking if user ${testEmail} exists...`);
    try {
        const userRecord = await admin.auth().getUserByEmail(testEmail);
        uid = userRecord.uid;
        console.log(`User already exists in Auth with ID: ${uid}`);
    } catch (e) {
        if (e.code === 'auth/user-not-found') {
            console.log(`Creating new Auth user...`);
            const userRecord = await admin.auth().createUser({
                email: testEmail,
                password: testPassword,
                displayName: testName,
            });
            uid = userRecord.uid;
            console.log(`Successfully created Auth user with ID: ${uid}`);
        } else {
            throw e;
        }
    }

    // 2. Fetch all products from our newly populated database
    const productsSnapshot = await db.collection('products').get();
    const productIds = productsSnapshot.docs.map(doc => doc.id);
    
    if (productIds.length === 0) {
        console.log('No products found in the database. Please run population script first.');
        process.exit(1);
    }
    
    console.log(`Found ${productIds.length} products to assign.`);

    // 3. Create/Update user profile in Firestore
    const userProfileRef = db.collection('users').doc(uid);
    const userProfileDoc = await userProfileRef.get();

    const profileData = {
        email: testEmail,
        displayName: testName,
        purchasedProducts: productIds,
        // Optional default fields
        courseProgress: {},
        savedArticles: [],
        createdAt: userProfileDoc.exists && userProfileDoc.data().createdAt ? userProfileDoc.data().createdAt : admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userProfileRef.set(profileData, { merge: true });
    
    console.log(`\n✅ TEST ACCOUNT FULLY SETUP ✅`);
    console.log(`-----------------------------------`);
    console.log(`Email:    ${testEmail}`);
    console.log(`Password: ${testPassword}`);
    console.log(`Products: All ${productIds.length} products acquired!`);
    console.log(`-----------------------------------\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Script Error:', error);
    process.exit(1);
  }
}

createAndAssignUser();