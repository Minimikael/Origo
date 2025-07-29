const admin = require('firebase-admin');

let firebaseAdmin = null;

const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase Admin is already initialized
    if (firebaseAdmin) {
      return firebaseAdmin;
    }

    // Initialize Firebase Admin SDK
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
    return firebaseAdmin;
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin SDK:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  return firebaseAdmin.firestore();
};

const getAuth = () => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin not initialized');
  }
  return firebaseAdmin.auth();
};

const verifyToken = async (idToken) => {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return { success: true, user: decodedToken };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeFirebaseAdmin,
  getFirestore,
  getAuth,
  verifyToken
}; 