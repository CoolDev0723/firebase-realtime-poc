import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [sendMessage, setSendMessage] = useState("");
  const [sendBtnDisabled, setSendBtnDisabled] = useState(false);
  const [getBtnDisabled, setGetBtnDisabled] = useState(false);
  const [messages, setMessages] = useState([]);

  const postMessage = async() => {
    setSendBtnDisabled(true);
    const params = {
      from_user_id: 'user1',
      to_user_id: 'user2',
      message: sendMessage,
    };
    await axios.post('http://localhost:3000/users/send_message', params);
    setSendBtnDisabled(false);
  }

  const getMessage = () => {
    setGetBtnDisabled(true);
    const params = {
      user_id: 'user2',
    };
    axios.post('http://localhost:3000/users/get_message', params)
      .then(response => {
        console.log("data", response.data);
        let get_messages = [];
        if (Object.keys(response.data).length > 0) {
          let sort_by_timestamp = {};
          Object.keys(response.data).map((key)=>{
            sort_by_timestamp[response.data[key]["timestamp"]] = response.data[key];
          })
          console.log("sort_by_timestamp", sort_by_timestamp);
          Object.keys(sort_by_timestamp).sort().reverse().forEach(key => {
            get_messages.push(sort_by_timestamp[key]);
          });
          console.log("get_messages", get_messages);
        }
        setMessages(get_messages);
        setGetBtnDisabled(false);
      });
  }

  return (
    <div style={{width:"50%", margin: "auto"}}>
      <div >
        <p>USER1</p>
        <input onChange={(e)=>setSendMessage(e.target.value)} value={sendMessage} />
        <button onClick={postMessage} disabled={sendBtnDisabled}>send message</button>
      </div>
      <div >
        <p>USER2</p>
        <button onClick={getMessage} disabled={getBtnDisabled}>get message</button>
        {messages.length > 0 && (
          messages.map(message_info=>{
            return (
              <>
                <div>Sender ID: {message_info.senderId}</div>
                <div>Message: {message_info.message}</div>
              </>
            )
          })
        )}
      </div>
    </div>
  );
}

export default App;
