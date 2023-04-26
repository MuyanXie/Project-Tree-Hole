import { or, updateDoc, where } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import Header from "../display/Header";
import { Button } from "react-bootstrap";

const ChatList = () => {
  const [ChatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      or(
        where("sender", "==", auth.currentUser.uid),
        where("recipient", "==", auth.currentUser.uid)
      ),
      orderBy("last", "desc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatList(data);
    });
    return () => {
      unsub();
    };
  }, []);

  const onClick = ({ chat }) => {
    if (auth.currentUser.uid === chat.sender) {
      updateDoc(doc(db, "messages", chat.id), {
        senderUnread: false,
      });
    } else {
      updateDoc(doc(db, "messages", chat.id), {
        recipientUnread: false,
      });
    }
    navigate("/dialog", {
      state: {
        id: chat.id,
        sender: chat.sender,
        recipientName: chat.recipientName,
        senderName: chat.senderName,
      },
    });
  };

  // #FFDD3C yellow -> for unread messages
  // #e6e6e6 grey -> for read messages

  return (
    <div>
      <Header name={"Chatlist"} />
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
          fontFamily: "sans-serif",
        }}
      >
        Your Chats
      </h1>
      {ChatList.map((chat) => (
        <div key={chat.id}>
          <div
            style={{
              background:
                chat.sender === auth.currentUser.uid
                  ? chat.senderUnread
                    ? "#FFDD3C"
                    : "#e6e6e6"
                  : chat.recipientUnread
                  ? "#FFDD3C"
                  : "#e6e6e6",
              padding: "10px",
              borderRadius: "20px",
              width: "50%",
              margin: "auto",
              justifyItems: "space-between",
              display: "flex",
              border: "0px",
              marginBottom: "15px",
            }}
          >
            <h5
              style={{
                padding: "10px",
                color: "black",
                margin: "auto",
                marginLeft: "0px",
              }}
            >
              {chat.last.toDate().toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </h5>
            <h4
              style={{
                padding: "10px",
                color: "black",
                margin: "auto",
                marginLeft: "-10%",
              }}
            >
              Chat with{" "}
              {auth.currentUser.uid === chat.sender
                ? chat.recipientName
                : chat.senderName}
            </h4>
            <Button
              variant="light"
              onClick={() =>
                onClick({
                  chat: chat,
                })
              }
            >
              Open
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
