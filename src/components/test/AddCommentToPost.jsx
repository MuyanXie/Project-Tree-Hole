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
import CloseButton from "react-bootstrap/CloseButton";
import classes from "./AddComment.module.css";

const AddCommentToPost = ({ parentid, onClose }) => {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [errors, setErrors] = useState({});

  const test = (e) => {
    e.preventDefault();
    console.log(formData.comment);
  };

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
      <Form>
        <Form.Group className="mb-3">
          <CloseButton onClick={onClose} />
          <br></br>
          <div className={classes.or}></div>
          <br></br>
          <Form.Label className="form-label" style={{fontSize : "15px"}}>
            Enter your Comment...</Form.Label>
            <div class="input-group">
              <textarea
                class="form-control"
                aria-label="With textarea"
                onChange={onChange}
                id="floatingInput"
                name="comment"
                value={formData.comment}
                style={{ resize: "none" }}
                rows="8"
              ></textarea>
            </div>
            <br></br>
          {errors.comment && (
            <div className="alert alert-danger" role="alert">
              {errors.comment}
            </div>
          )}
          <Form.Text className="text-muted">
            Say something nice for the community!
          </Form.Text>
          <br></br>
          <br></br>
          <Button variant="primary" type="submit" onClick={addCommentHandler}>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default AddCommentToPost;
