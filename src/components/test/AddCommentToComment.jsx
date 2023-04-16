import { auth, db } from "../../firebase";
import { useState } from "react";
import { collection, addDoc, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddCommentToComment = ({parentid, onClose}) => {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const addCommentHandler = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.comment) {
      formErrors.comment = "Enter a comment please!";
    }
    if (Object.keys(formErrors).length === 0) {
      addDoc(collection(db, "comments"), {
        name: auth.currentUser.displayName,
        text: formData.comment,
        likes: [],
        date: new Date(),
        sons: [],
      }).then((docRef) => {
        setFormData({ comment: "" });
        setErrors({});
        const commentref = doc(db, "comments", parentid);
        updateDoc(commentref, {
          sons: arrayUnion(docRef.id),
        });
      }).then(()  => {
        
        navigate("/test")
      }
      );
    }
    setErrors(formErrors);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <form onSubmit={addCommentHandler}>
        <div style={{margin: "none", boxShadow: "none", borderRadius: "none"}}>
          <label htmlFor="comment">Comment</label>
          <textarea
            className="form-control"
            id="comment"
            name="comment"
            rows="3"
            value={formData.comment}
            onChange={onChange}
          ></textarea>
          {errors.comment && (
            <div role="alert">
              {errors.comment}
            </div>
          )}
        </div>
        <button type="submit">
          Add Comment
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
        <button type="button">
          Modify
        </button>
      </form>
    </div>
  );
};

export default AddCommentToComment;
