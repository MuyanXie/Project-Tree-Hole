import { getAuth, sendEmailVerification } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../static/pics/UChicago_Aerial-Mansueto.jpeg";
import { Button } from "react-bootstrap";

const VerifyEmail = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setInterval(() => {
      auth.currentUser.reload().then(async () => {
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
      <div>
        <img
          src={background}
          alt="UChicago Dusk"
          width="100%"
          height="100%"
          style={{
            position: "relative",
            zIndex: "-1",
            width: "100%",
            height: "100%",
          }}
        />
        <div
          style={{
            zIndex: "1",
            position: "absolute",
            margin: "auto",
            textAlign: "center",
            color: "white",
            left: "80%",
            transform: "translate(-50%, 0)",
            top: "5%",
            width: "40%",
            fontSize: "xx-large",
          }}
        >
          <h1
            style={{
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            University of Chicago Tree Hole
          </h1>
          <h5
            style={{
              alignItems: "center",
              fontFamily: "sans-serif",
              textAlign: "center",
            }}
          >
            Honorly built by the UChicago Tree Hole Team
          </h5>
        </div>
        <div
          style={{
            zIndex: "1",
            left: "50%",
            padding: "5px",
            top: "60%",
            transform: "translate(-50%, -50%)",
            color: "white",
            position: "absolute",
            margin: "auto",
            width: "50%",
            height: "50%",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              alignItems: "center",
              fontFamily: "sans-serif",
              fontSize: "xxx-large",
            }}
          >
            We'll need to verify your email
          </h1>
          <br></br>
          <div 
            style={{
              textAlign: "center",
            }}
          >
            <Button
            class="btn btn-light"
              onClick={handleClick}
              style={{
                marginTop: "8%",
                textAlign: "center",
                alignItems: "center",
                fontSize: "xx-large",
                fontFamily: "sans-serif",
              }}
            >
              Resend Email
            </Button>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
