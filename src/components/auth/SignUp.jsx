//styling finished
//TODO: finish the styling of the form
//TODO: add the error handling sent from the server

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import logo from "../../static/pics/University_of_Chicago-Logo.wine.png";
import classes from "./Signup.module.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    displayName: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!formData.email) {
      formErrors.email = "Email is required";
    }
    if (!formData.password) {
      formErrors.password = "Password is required";
    }
    if (formData.password !== formData.passwordConfirm) {
      formErrors.passwordConfirm = "Passwords do not match";
    }
    if (formData.displayName.length < 6) {
      formErrors.displayName = "Display Name is required to be at least 6 characters long";
    }
    if (Object.keys(formErrors).length === 0) {
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: formData.displayName + uuid().slice(0, 4),
          });
          navigate("/verifyemail");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setErrors(formErrors);
  };

  return (
    <div>
      <form className={classes.form}>
        <br></br>

        <img
          src={logo}
          alt="logo"
          style={{
            maxWidth: "60%",
            maxHeight: "10%",
            display: "block",
            margin: "auto",
          }}
        ></img>

        <br></br>

        <label className={classes.label}>Basic Info</label>
          <br></br>
        <input
          type="email"
          placeholder="Enter Your Email"
          name="email"
          onChange={handleChange}
          className={classes.input}
        ></input>
        {errors.email && <p className={classes.error}>{errors.email}</p>}
        <br></br>

        <input
          type="password"
          placeholder="Enter Your Password"
          name="password"
          onChange={handleChange}
          className={classes.input}
        ></input>
        {errors.password && <p className={classes.error}>{errors.password}</p>}

        <br></br>

        <input
          type="password"
          placeholder="Re-enter Your Password"
          name="passwordConfirm"
          onChange={handleChange}
          className={classes.input}
        ></input>
        {errors.passwordConfirm && (
          <p className={classes.error}>{errors.passwordConfirm}</p>
        )}

        <br></br>

        <label className={classes.label}>Display Name</label>
        <br></br>
        <input
          type="text"
          placeholder="Will include unique appendix"
          name="displayName"
          onChange={handleChange}
          className={classes.input}
        ></input>
        {errors.displayName && (
          <p className={classes.error}>{errors.displayName}</p>
        )}

        <br />
        <br />

        <button className={classes.btn} type="submit" onClick={handleSubmit}>
          Sign Up
        </button>

        <br />

        <div className={classes.lineor}>
          <div className={classes.or}></div>
          <div className={classes.textor}>or</div>
          <div className={classes.or}></div>
        </div>

        <div>
          <p className={classes.label}>
            Already have an account?&ensp;
            <a href="/signin" className={classes.link}>
              Sign In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
