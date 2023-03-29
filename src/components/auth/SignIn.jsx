import { signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import { auth } from "../../firebase";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        // TODO: Add Firebase login logic
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        console.log(userCredential)
    }).catch((error) => {
        console.log(error)
    })
    };

    return (
        <div className="sign-in-container">
        <form>
            <h1>Log In</h1>
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

            <button type="submit" onClick={handleSubmit}>Log In</button>
        </form>
        </div>
    );
    }

export default SignIn;