import { getAuth, sendEmailVerification } from "firebase/auth";

const VerifyEmail = () => {
  const auth = getAuth();

  // useEffect (() => {
  //     sendEmailVerification(auth.currentUser)
  //     .then(() => {
  //       console.log("Email verification sent!");
  //       console.log(auth.currentUser);
  //     });
  // }, []);

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
