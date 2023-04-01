import { useEffect, useState} from "react";
import { auth } from '../../firebase';

function SignOut(){
    const [user, setUser] = useState(null);

    useEffect(()=>{
        auth.signOut();
        setUser("");
        localStorage.clear();
    },[]
    );
}

export default SignOut;