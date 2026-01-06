import "dotenv/config";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

export const db = admin.firestore();
