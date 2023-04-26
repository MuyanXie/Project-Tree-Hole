// a separate new screen for adding a new post

import React, { useState } from "react";

import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Header from "./Header";

const AddNewPost = () => {
  const [formData, setFormData] = useState({
    text: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onClick = async (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.text) {
      formErrors.text = "Enter a post please!";
    }
    if (Object.keys(formErrors).length === 0) {
      addDoc(collection(db, "posts"), {
        text: formData.text,
        deleted: false,
        likes: [],
        time: new Date(),
        name: auth.currentUser.displayName,
        anonymous: false,
        sons: [],
        uid: auth.currentUser.uid,
      }).then(() => {
        navigate("/myposts");
      });
    }
    setErrors(formErrors);
  };

  return (
    <div>
      <Header name="Add Post..." />
      <Form style={{
        width: "60%",
        margin: "auto",
        height: "100%",
      }}>
        <Form.Group className="mb-3">
          <Form.Label style={{
            fontSize: "25px",
            fontFamily: "sans-serif",
            marginTop: "3%",
            marginBottom: "3%",
            contentAlign: "center",
            textAlign: "center",
          }}>So, what do you have in mind now?</Form.Label>
          <div class="input-group">
            <textarea
              class="form-control"
              aria-label="With textarea"
              onChange={onChange}
              id="floatingInput"
              name="text"
              value={formData.text}
              style={{ resize: "none", fontSize: "30px",
              borderRadius: "10px",
              marginBottom: "3%",
            }}
              rows="8"
            ></textarea>
          </div>
        </Form.Group>
        <Button variant="success" type="submit" onClick={onClick} 
        style={{
            fontSize: "20px",
        }}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default AddNewPost;
