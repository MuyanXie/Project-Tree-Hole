import { useEffect } from "react";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function SignOut() {
    const navigate = useNavigate();

    useEffect(() => {
        auth.signOut()
            .then(() => {
                localStorage.clear();
                navigate('/signin');
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    }, [navigate]);

    return null;
}

export default SignOut;
