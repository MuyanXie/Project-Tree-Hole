import { db } from "../../firebase";
import { useState } from "react";
import { getDocs, collection } from "firebase/firestore";

const Display = () => {
  const [commentslist, setCommentslist] = useState([]);

  const getComments = async () => {
    const querySnapshot = await getDocs(collection(db, "comments"));
    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push(doc.data());
    });
    setCommentslist(comments);
  };

  return (
    <div>
      <button onClick={getComments}>Get Comments</button>
      <ul>
        {commentslist.map((comment) => (
          <li key={comment.id}>
            {comment.name} - {comment.date.toDate().toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Display;
