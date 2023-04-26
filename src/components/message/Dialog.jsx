import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";

const Dialog = () => {
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const messagesContainerRef = useRef(null);

  const {state} = useLocation();
  const chatId = state.id;
  const sender = state.sender;

  useEffect(() => {
    // Get initial messages from database
    const q = query(collection(db, `messages/${chatId}/chat`), orderBy("date"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setMessagesList(data);
      if (auth.currentUser.uid === sender) {
        updateDoc(doc(db, "messages", chatId), {
          senderUnread: false,
        });
      } else {
        updateDoc(doc(db, "messages", chatId), {
          recipientUnread: false,
        });
      }
    });
    return () => {
      unsub();
    };
  }, [chatId, sender]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  const onClick = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!message) {
      formErrors.message = "Enter a message please!";
    }
    if (Object.keys(formErrors).length === 0) {
      addDoc(collection(db, `messages/${chatId}/chat`), {
        text: message,
        sender: auth.currentUser.uid,
        date: new Date(),
      });
      if(auth.currentUser.uid === sender) {
        updateDoc(doc(db, "messages", chatId), {
          recipientUnread: true,
        });
      } else {
        updateDoc(doc(db, "messages", chatId), {
          senderUnread: true,
        });
      }

      setMessage("");
    }
    setErrors(formErrors);
  };

  const fetchMoreMessages = async () => {
    const q = query(
      collection(db, `messages/${chatId}/chat`),
      orderBy("date", "desc").startAfter(messagesList[0].date).limit(10)
    );
    const querySnapshot = await q.get();
    const data = querySnapshot.docs.map((doc) => doc.data());
    setMessagesList((prevState) => [...data, ...prevState]);
  };

  const onScroll = () => {
    const element = messagesContainerRef.current;
    if (element.scrollTop === 0) {
      fetchMoreMessages();
    }
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  const scrollToBottom = () => {
    const element = messagesContainerRef.current;
    element.scrollTop = element.scrollHeight - element.clientHeight;
  };

  return (
    <div>
      <div
        ref={messagesContainerRef}
        style={{
          height: "75%",
          width: "50%",
          left: "50%",
          top: "10%",
          transform: "translate(-50%, 0)",
          border: "1px solid black",
          overflowY: "scroll",
          padding: "10px",
          position: "absolute",
        }}
        onScroll={onScroll}
      >
        {messagesList.map((message) => (
          <div key={message.sender}>
            <p>{message.text}</p>
            <p>{message.sender}</p>
          </div>
        ))}
      </div>
      <div
        style={{
          width: "50%",
          left: "50%",
          top: "90%",
          transform: "translate(-50%, 0)",
          position: "absolute",
        }}
      >
        <input
          type="text"
          name="message"
          value={message}
          onChange={onChange}
          style={{ width: "80%" }}
          placeholder="Type your message here..."
        />
        <button onClick={onClick}>Send</button>
      </div>
      {errors.message && <p>{errors.message}</p>}
    </div>
  );
};
export default Dialog;