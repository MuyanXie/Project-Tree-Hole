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
import { Button } from "react-bootstrap";
import Header from "../display/Header";

const Dialog = () => {
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const messagesContainerRef = useRef(null);

  const { state } = useLocation();
  const chatId = state.id;
  const sender = state.sender;
  const recipientName = state.recipientName;
  const senderName = state.senderName;

  const chatter = auth.currentUser.uid === sender ? recipientName : senderName;

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
      if (auth.currentUser.uid === sender) {
        updateDoc(doc(db, "messages", chatId), {
          recipientUnread: true,
        });
      } else {
        updateDoc(doc(db, "messages", chatId), {
          senderUnread: true,
        });
      }
      updateDoc(doc(db, "messages", chatId), {
        last: new Date(),
      });
      setMessage("");
    }
    setErrors(formErrors);
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
      <Header name={"Chat"} />
      <h1
        style={{
          fontFamily: "Times New Roman",
          top: "15%",
          color: "grey",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Your Chat with {chatter}
      </h1>
      <div
        ref={messagesContainerRef}
        style={{
          height: "65%",
          width: "50%",
          left: "50%",
          top: "15%",
          transform: "translate(-50%, 0)",
          border: "1px solid black",
          overflowY: "scroll",
          padding: "10px",
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "10px",
          fontFamily: "Times New Roman",
          fontSize: "20px",
        }}
      >
        {messagesList.map((message) => (
          <div key={message.date}>
            <div
              style={{
                display: "block",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <p
                style={{
                  margin: "0px",
                  left: message.sender === auth.currentUser.uid ? "95%" : "0%",
                  position: "sticky",
                  justifyItems: "right",
                  backgroundColor:
                    message.sender === auth.currentUser.uid
                      ? "#DFFF00"
                      : "#e6e6e6",
                  width: "fit-content",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          width: "50%",
          left: "50%",
          top: "85%",
          transform: "translate(-50%, 0)",
          position: "absolute",
          height: "8%",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "Times New Roman",
        }}
      >
        <input
          type="text"
          name="message"
          value={message}
          onChange={onChange}
          style={{
            width: "80%",
            height: "100%",
            paddingLeft: "10px",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            border: "0px",
            fontFamily: "Times New Roman",
          }}
          placeholder="Type your message here..."
        />
        <Button
          onClick={onClick}
          style={{
            width: "20%",
            height: "100%",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            padding: "0px",
            fontFamily: "Times New Roman",
          }}
        >
          Send
        </Button>
      </div>
      {errors.message && <p>{errors.message}</p>}
    </div>
  );
};
export default Dialog;
