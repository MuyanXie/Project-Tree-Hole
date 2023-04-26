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
      state: { id: chat.id, sender: chat.sender, recipientName: chat.recipientName, senderName: chat.senderName},
    });
  };

  return (
    <div>
      <Header name={"Chatlist"}/>
      {ChatList.map((chat) => (
        <div key={chat.id}>
          <p>{chat.id}</p>
          <p>{chat.sender}</p>
          <button
            onClick={() =>
              onClick({
                chat:chat
              })
            }
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
