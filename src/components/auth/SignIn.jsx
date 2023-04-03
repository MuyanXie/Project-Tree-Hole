//error message is not generated
//fix the navigation issue
//display error message from the server end

import { signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import { auth } from "../../firebase";
import classes from './Signin.module.css';
import logo from '../../static/pics/University_of_Chicago-Logo.wine.png';
import {useNavigate} from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const token = await userCredential.user.getIdToken();
          localStorage.setItem('token', token);
          if (userCredential.user.emailVerified) {
            navigate('/home');
          } else {
            navigate('/verifyemail');
          }
        } catch (error) {
          console.log(error);
        }
      };
      

    return (
        <div>
        <form className={classes.form}>
            <br></br>

            <img
            src={logo}
            alt="logo"
            style={{maxWidth: '60%', maxHeight: '10%', display: 'block', margin: 'auto'}}
            ></img>

            <br></br>
            <br></br>

            <input 
            className={classes.input}
            type="email" 
            placeholder="Enter Your Email"
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            ></input>

            <br></br>

            <input 
            className={classes.input}
            type="password" 
            placeholder="Enter Your Password"
            value={password}
            onChange = {(e) => setPassword(e.target.value)}
            ></input>

            <br /> 
            <br />

            <button className={classes.btn} type="submit" onClick={handleSubmit}>Log In</button>
            
            <br />

            <div className={classes.lineor}>
                <div className={classes.or}></div>
                <div className={classes.textor}>or</div>
                <div className={classes.or}></div>
            </div>

            <div>
                <p className={classes.label}>
                    Don't have an account?&ensp;
                    <a href="/signup" className={classes.link}>Sign Up</a>
                </p>
            </div>

        </form>
        </div>
    );
    }

export default SignIn;