import { getAuth, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      console.log("unsubscribing");
      auth.currentUser
        .reload()
        .then(() => {
          console.log("reloaded");
          console.log(auth.currentUser);
          setUser(auth.currentUser);
        })
        .then(() => {
          console.log(auth.currentUser.emailVerified)
          if (auth.currentUser.emailVerified) {
            console.log("verified");
            navigate("/home");
          }
        });
    }, 2000);
    return () => clearInterval(timerId);
  }, [auth, navigate]);

  const handleClick = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("Email verification sent!");
      console.log(auth.currentUser);
    });
  };

  return (
    <div>
      <h1>We'll need to verify your email</h1>
      <button onClick={handleClick}>Resend Email</button>
    </div>
  );
};

export default VerifyEmail;
