var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey.json");
const databaseURL = "https://fir-realtime-poc-a41fe-default-rtdb.firebaseio.com"
// const databaseURL = "https://fir-realtime-poc-a41fe-default-rtdb.REGION.firebasedatabase.app"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/send_message', async function(req, res, next) {
  try {
    const messagesRef = admin.database().ref("messages"); // Reference to the "messages" node in the database

    // Generate a unique key for the new message
    const newMessageRef = messagesRef.push();

    // Set the message data under the unique key
    await newMessageRef.set({
      senderId: req.body.from_user_id,
      recipientId: req.body.to_user_id,
      message: req.body.message,
      timestamp: admin.database.ServerValue.TIMESTAMP // Add server timestamp for message creation time
    });
    res.send("Message registered successfully.");
  } catch (error) {
    res.send(error);
  }
});

router.post('/get_message', async function(req, res, next) {
  try {
    const messagesRef = admin.database().ref("messages"); // Reference to the "messages" node in the database

    // Query the database to fetch messages where the recipient ID matches
    const snapshot = await messagesRef.orderByChild("recipientId").equalTo(req.body.user_id).once("value");

    // Extract message data from the snapshot
    const messages = snapshot.val();

    // Return the messages
    res.send(messages || {});
  } catch (error) {
    console.error("Error getting message data by recipient ID:", error);
    res.send([]);
  }
});

module.exports = router;
