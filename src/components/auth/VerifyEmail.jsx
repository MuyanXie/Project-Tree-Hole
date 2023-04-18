import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log("unsubscribing");
      auth.currentUser
        .reload()
        .then(() => {
          if (auth.currentUser.emailVerified) {
            navigate("/home");
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
