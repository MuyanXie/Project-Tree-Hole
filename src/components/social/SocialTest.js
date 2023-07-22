import { useEffect } from "react";
import Header from "../display/Header";
import axios from "axios";
import { auth } from "../../firebase";
import { dev_host as host } from "./social_config";

const SocialTest = () => {
    useEffect(() => {
        console.log("SocialTest");
        const testsend = async () => {
            const token2 = await auth.currentUser.getIdToken(true)
            await axios.post(`${host}/api/socialtest/`, {
                tester : "123",
                auth : token2,
            }, {
                headers: {
                    Authorization: token2
                }
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