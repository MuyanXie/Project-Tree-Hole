import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

function Test({ user }) {
  const [data, setData] = useState(null);
  const [text, setText] = useState('');

  useEffect(() => {
    // Retrieve the user's data from Firestore
    // console.log(user);
    //try running the reload method on the current user. 
    //firebaseUser.reload() that should refresh the emailVerified var.
    //需要在这里加上这个，不然user.emailVerified是false， 因为没有update一下你的user
    console.log(auth.currentUser);
    const q = query(collection(db, 'data'), where('uid', '==', user.uid));
    const getData = async () => {
      const querySnapshot = await getDocs(q);
      setData(querySnapshot.docs.map((doc) => doc.data()));
    };
    getData();
  }, [user.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add the new data to Firestore
    await addDoc(collection(db, 'data'), {
      uid: user.uid,
      text: text,
    });
    setText('');
  };

  return (
    <div>
      <h1>Secret Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Add Data:
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
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
