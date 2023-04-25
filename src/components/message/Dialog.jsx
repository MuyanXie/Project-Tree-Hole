// // // Assume I'm using Firebase and React.js; I wanna make a page that
// // // enable User A, with uid 234, and User B, with uid 567, to chat and
// // // communicate via messages in the webpage; That being said, I wish when
// // // User B send a message, the message will be sent to firestore and in
// // // real-time, the sent message will appear on User A's page; Give me the
// // // code and how to structure the firestore

import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
} from "firebase/firestore";

// const Dialog = ({}) => {
//   const [messagesList, setMessagesList] = useState([]);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState({});
//   const messagesContainerRef = useRef(null);

//   const chatId = "0VOwHw3fvtrc9ZmrusBv";
//   useEffect(() => {
//     const q = query(collection(db, `messages/${chatId}/chat`), orderBy("date"));
//     const unsub = onSnapshot(q, (querySnapshot) => {
//       const data = querySnapshot.docs.map((doc) => doc.data());
//       setMessagesList(data)
//       scrollToBottom()
//     });
//     return () => unsub();
//   }, []);
//   const onChange = (e) => {
//     setMessage(e.target.value);
//   };
//   const onClick = (e) => {
//     e.preventDefault();
//     let formErrors = {};
//     if (!message) {
//       formErrors.message = "Enter a message please!";
//     }
//     if (Object.keys(formErrors).length === 0) {
//       addDoc(collection(db, `messages/${chatId}/chat`), {
//         text: message,
//         sender: auth.currentUser.uid,
//         date: new Date(),
//       });
//       setMessage("");
//     }
//     setErrors(formErrors);
//   };
//   const fetchMoreMessages = async () => {
//     const q = query(
//       collection(db, `messages/${chatId}/chat`),
//       orderBy("date", "desc").startAfter(messagesList[0].date).limit(10)
//     );
//     const querySnapshot = await q.get();
//     const data = querySnapshot.docs.map((doc) => doc.data());
//     setMessagesList((prevState) => [...data, ...prevState]);
//   };
//   const onScroll = () => {
//     const element = messagesContainerRef.current;
//     if (element.scrollTop === 0) {
//       fetchMoreMessages();
//     }
//   };

//   const scrollToBottom = () => {
//     const element = messagesContainerRef.current;
//     element.scrollTop =  100000;
//     //element.scrollHeight + element.clientHeight;
//   };

//   return (
//     <div>
//       <div
//         ref={messagesContainerRef}
//         style={{
//           height: "75%",
//           width: "50%",
//           left: "50%",
//           top: "10%",
//           transform: "translate(-50%, 0)",
//           border: "1px solid black",
//           overflowY: "scroll",
//           padding: "10px",
//           position: "absolute",
//         }}
//         onScroll={onScroll}
//       >
//         {messagesList.map((message) => (
//           <div key={message.sender}>
//             <p>{message.text}</p>
//             <p>{message.sender}</p>
//           </div>
//         ))}
//       </div>
//       <div
//         style={{
//           width: "50%",
//           left: "50%",
//           top: "90%",
//           transform: "translate(-50%, 0)",
//           position: "absolute",
//         }}
//       >
//         <input
//           type="text"
//           name="message"
//           value={message}
//           onChange={onChange}
//           style={{ width: "80%" }}
//           placeholder="Type your message here..."
//         />
//         <button onClick={onClick}>Send</button>
//       </div>
//     </div>
//   );
// };
// export default Dialog;

const Dialog = ({}) => {
  const [messagesList, setMessagesList] = useState([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const messagesContainerRef = useRef(null);
  const chatId = "0VOwHw3fvtrc9ZmrusBv";
  useEffect(() => {
    // Get initial messages from database
    const q = query(collection(db, `messages/${chatId}/chat`), orderBy("date"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setMessagesList(data);
    });
    // Listen for new messages and update state
    const messagesRef = collection(db, `messages/${chatId}/chat`);
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newMessage = change.doc.data();
          setMessagesList((prevState) => [...prevState, newMessage]);
        }
      });
    });
    return () => {
      unsub();
      unsubscribe();
    };
  }, []);
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
    </div>
  );
};
export default Dialog;
