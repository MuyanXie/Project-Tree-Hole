import { getAuth, sendEmailVerification } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setInterval(() => {
      auth.currentUser
        .reload()
        .then(async() => {
          if (auth.currentUser.emailVerified) {
            const token = await auth.currentUser.getIdToken();
            localStorage.setItem("token", token);
            navigate("/signout");
          }
        });
    }, 2000);
    return () => clearInterval(timerId);
  }, [auth, navigate]);

  useEffect(() => {
    if (!auth.currentUser.emailVerified) {
      sendEmailVerification(auth.currentUser);
    }
  }, [auth]);


  const handleClick = () => {
    sendEmailVerification(auth.currentUser);
  };

  return (
    <div>
      <h1>We'll need to verify your email</h1>
      <button onClick={handleClick}>Resend Email</button>
    </div>
  );
};

export default VerifyEmail;
