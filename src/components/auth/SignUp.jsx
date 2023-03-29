import { createUserWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import { auth } from "../../firebase";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        // TODO: Add Firebase login logic
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        console.log(userCredential)
    }).catch((error) => {
        console.log(error)
    })
    };

    return (
        <div className="sign-up-container">
        <form>
            <h1>Sign Up</h1>
            <input 
            type="email" 
            placeholder="Enter Your Email"
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            ></input>

            <input 
            type="password" 
            placeholder="Enter Your Password"
            value={password}
            onChange = {(e) => setPassword(e.target.value)}
            ></input>

            <button type="submit" onClick={handleSubmit}>Sign Up</button>
        </form>
        </div>
    );
    }

export default SignUp;