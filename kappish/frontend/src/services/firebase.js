import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG } from '../config/constants';

// Validate Firebase configuration
const validateFirebaseConfig = (config) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing Firebase configuration fields:', missingFields);
    throw new Error('Invalid Firebase configuration');
  }
  
  return config;
};

// Initialize Firebase with validated config
const firebaseConfig = validateFirebaseConfig(FIREBASE_CONFIG);
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure auth persistence
auth.setPersistence('local');

export default app; 