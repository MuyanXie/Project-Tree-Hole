import { getAuth, sendEmailVerification } from "firebase/auth";
import { useEffect } from "react";

const VerifyEmail = () => {
  const auth = getAuth();

  useEffect(() => {
    const timerId = setInterval(() => {
      auth.currentUser
        .reload()
        .then(() => {
          if (auth.currentUser.emailVerified) {
            window.location.reload();
          }
        });
    }, 2000);
    return () => clearInterval(timerId);
  }, [auth]);

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
