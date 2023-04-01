import { createUserWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';
import logo from '../pics/University_of_Chicago-Logo.wine.png';
import classes from './Signup.module.css';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: ''
      });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value
        });
      }

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};
          if (!formData.email) {
            formErrors.email = 'Email is required';
          }
          if (!formData.password) {
            formErrors.password = 'Password is required';
          }
          if (formData.password !== formData.passwordConfirm) {
            formErrors.passwordConfirm = 'Passwords do not match';
          }
        if (Object.keys(formErrors).length === 0) {
        createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
        console.log(userCredential)
        navigate('/verifyemail')
        }).catch((error) => {
            console.log(error)
        })
        }
        setErrors(formErrors);

    };

    return (
        <div className="sign-up-container">
        <form>
            <h1>Sign Up</h1>
            <input 
            type="email" 
            placeholder="Enter Your Email"
            name = "email"
            onChange = {handleChange}
            ></input>
            {errors.email && <p>{errors.email}</p>}

            <input 
            type="password" 
            placeholder="Enter Your Password"
            name = "password"
            onChange = {handleChange}
            ></input>
            {errors.password && <p>{errors.password}</p>}

            <input
            type="password"
            placeholder="Re-enter Your Password"
            name = "passwordConfirm"
            onChange = {handleChange}
            ></input>
            {errors.passwordConfirm && <p>{errors.passwordConfirm}</p>}

            <button type="submit" onClick={handleSubmit}>Sign Up</button>
        </form>
        </div>
    );
    }

export default SignUp;