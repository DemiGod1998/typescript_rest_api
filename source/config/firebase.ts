var admin = require("firebase-admin");

var serviceAccount = require("./journal-rest-api-57dee-firebase-adminsdk-fcjaz-68b5f0a3a5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://journal-rest-api-57dee-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
export { db }