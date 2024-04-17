import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from "firebase/compat/app";
import "firebase/compat/database";


// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
};


firebase.initializeApp(firebaseConfig);

const db = firebase.database();


function App() {
  const [selectedUser, setSelectedUser] = useState("user1");
  const [sendMessage, setSendMessage] = useState("");
  const [sendBtnDisabled, setSendBtnDisabled] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = db.ref("messages");

    messagesRef.on("value", (snapshot) => {
      try {
        const messagesData = snapshot.val();
        if (messagesData) {
          const filteredMessages = Object.values(messagesData).filter(message => message.recipientId === "user2");
          setMessages(filteredMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    return () => {
      messagesRef.off("value");
    };
  }, []);

  const postMessage = async() => {
    setSendBtnDisabled(true);
    const params = {
      from_user_id: 'user1',
      to_user_id: 'user2',
      message: sendMessage,
    };
    await axios.post('http://localhost:3000/users/send_message', params);
    setSendBtnDisabled(false);
    setSendMessage("");
  }

  console.log("messages", messages);

  return (
    <div style={{width:"50%", margin: "auto", marginTop:"100px"}}>
      <div style={{display: "flex", justifyContent:"space-between"}}>
        <button onClick={()=>setSelectedUser("user1")} disabled={selectedUser === "user1"}>USER 1</button>
        <button onClick={()=>setSelectedUser("user2")} disabled={selectedUser === "user2"}>USER 2</button>
      </div>
      {selectedUser === "user1" && (
        <div style={{marginTop: "10px"}}>
          <input onChange={(e)=>setSendMessage(e.target.value)} value={sendMessage} />
          <button onClick={postMessage} disabled={sendBtnDisabled}>send message</button>
        </div>
      )}
      {selectedUser === "user2" && (
        <div>
          <h1>Messages</h1>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
