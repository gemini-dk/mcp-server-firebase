import * as admin from 'firebase-admin';
import fs from 'fs';

function initializeFirebase() {
  const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
  
  if (!serviceAccountPath) {
    console.error('Firebase initialization skipped: SERVICE_ACCOUNT_KEY_PATH is not set');
    return null;
  }

  try {
    const serviceAccount = require(serviceAccountPath);
    const projectId = getProjectId(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: `${projectId}.appspot.com`
    });

    return admin;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
}

function getProjectId(serviceAccountPath?: string): string {
  if (!serviceAccountPath) {
    serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
    if (!serviceAccountPath) {
      console.error('Cannot get project ID: SERVICE_ACCOUNT_KEY_PATH is not set');
      return '';
    }
  }
  
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    return serviceAccount.project_id;
  } catch (error) {
    console.error('Failed to get project ID:', error);
    return '';
  }
}

const adminApp = initializeFirebase();
const db = adminApp ? admin.firestore() : null;

export { db, admin, getProjectId };
