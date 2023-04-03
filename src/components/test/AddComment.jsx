import { db } from "../../firebase";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";

const AddComment = () => {
  const [comment, setComment] = useState("");

  const addComment = () => {
    addDoc(collection(db, "comments"), {
      name: comment,
      date: new Date(),
    })
    .then((docRef) => {
      console.log("Comment added with ID: ", docRef.id);
      setComment("");
    })
    .catch((error) => {
      console.error("Error adding comment: ", error);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
}

export default AddComment;
