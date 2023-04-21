import { useState, useEffect } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { IconArrowLeft, IconHeart } from '@tabler/icons-react';

function Test({ user }) {
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const [like, setLike] = useState(false);


  useEffect(() => {
    auth.currentUser.getIdToken(true);
    console.log(auth.currentUser);
    const q = query(collection(db, "data"), where("uid", "==", user.uid));
    const getData = async () => {
      const querySnapshot = await getDocs(q);
      setData(querySnapshot.docs.map((doc) => doc.data()));
    };
    getData();
  }, [user.uid]);

  const onClick = () => {
    setLike(!like);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add the new data to Firestore
    await addDoc(collection(db, "data"), {
      uid: user.uid,
      text: text,
    });
    setText("");
  };

  return (
    <div>
      <h1>Secret Page</h1>
      <IconArrowLeft color="red" size={48} />
      <IconHeart fill= {like ? "red" : "none" } role = "button"
      onClick={onClick}/>
      <form onSubmit={handleSubmit}>
        <label>
          Add Data:
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <button type="submit">Add</button>
      </form>
      {data ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Test;
