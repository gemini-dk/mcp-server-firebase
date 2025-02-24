import * as admin from 'firebase-admin';

import path from 'path';
import fs from 'fs';

const serviceAccountPath = process.env.SERVICE_ACCOUNT_KEY_PATH || path.resolve(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

function getProjectId(): string {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  return serviceAccount.project_id;
}
const projectId = getProjectId();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${projectId}.appspot.com`
});

const db = admin.firestore();

export { db, admin, getProjectId };
