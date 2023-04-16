import { auth, db } from "../../firebase";
import { useState } from "react";
import {
  collection,
  addDoc,
  arrayUnion,
  doc,
  updateDoc,
} from "firebase/firestore";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CloseButton from 'react-bootstrap/CloseButton';
import classes from "./AddComment.module.css";

const AddCommentToComment = ({ parentid, onClose }) => {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [errors, setErrors] = useState({});

const test = (e) => {
  e.preventDefault();
  console.log(formData.comment)
}

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
      })
        .then((docRef) => {
          setFormData({ comment: "" });
          setErrors({});
          const commentref = doc(db, "comments", parentid);
          updateDoc(commentref, {
            sons: arrayUnion(docRef.id),
          });
        })
        .then(() => {
          window.location.reload();
        });
    }
    setErrors(formErrors);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={classes.form}>
      {/* <form onSubmit={addCommentHandler}>
        <div
          style={{ margin: "none", boxShadow: "none", borderRadius: "none" }}
        >
          <label htmlFor="comment">Comment</label>
          <textarea
            className="form-control"
            id="comment"
            name="comment"
            rows="3"
            value={formData.comment}
            onChange={onChange}
          ></textarea>
          {errors.comment && <div role="alert">{errors.comment}</div>}
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form> */}

      <Form className={classes.form}>
        <Form.Group className="mb-3">
          <CloseButton onClick={onClose} />
          <div className={classes.or}></div>
          <br></br>
          <Form.Label>Enter Comment...</Form.Label>
          <Form.Control type="text" placeholder="Enter email" onChange={onChange} id="comment" name ="comment" value={formData.comment}/>
          <Form.Text className="text-muted">
            Say something nice for the community!
          </Form.Text>
          <Button variant="primary" type="submit" onClick={test}>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AddCommentToComment;
