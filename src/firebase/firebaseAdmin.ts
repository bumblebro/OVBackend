import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

const path = process.env.FIREBASE_CREDENTIALS;

import serviceAccount from "path";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export default admin;
