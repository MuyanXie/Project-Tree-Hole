import { useEffect } from "react";
import Header from "../display/Header";
import axios from "axios";
import { auth } from "../../firebase";

const SocialTest = () => {
    useEffect(() => {
        console.log("SocialTest");
        const testsend = async () => {
            await axios.post("http://127.0.0.1:5000/api/socialtest/", {
                tester : "123",
                auth : auth.currentUser.getIdToken(true)
            }
            )
            .then((res) => {
                console.log(res);
            }
            )
        }
        testsend();
    }
    , []);

    return (
        <div>
            <Header name = "social test"/>
            <h1>SocialTest</h1> 
        </div>
    );
}

export default SocialTest;