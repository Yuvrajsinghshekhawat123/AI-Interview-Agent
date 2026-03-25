 import admin from "firebase-admin";
import fs from "fs";

// ✅ Read JSON manually
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("./ai-agent-1cc12-firebase-adminsdk-fbsvc-74878c8b91.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;