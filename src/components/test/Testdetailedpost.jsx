import { useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useState } from "react";
import classes from "./Testdetailedpost.module.css";

const Testdetailedpost = () => {
  const { state } = useLocation();
  const [like, setLike] = useState(false);

  const likeHandler = () => {
    setLike(!like);
    // need to add a like to the database
  };

  return (
    <div>
      {state && (
        <div className={classes.post}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p className={classes.author} style={{ marginRight: "8px" }}>
              From: {state.name}{" "}
            </p>
            <p> </p>
            <Badge bg="info">Certified</Badge>
          </div>

          <div className={classes.or}></div>
          <br></br>
          <p className={classes.text}>{state.text}</p>
          <br></br>
          <div className={classes.or}></div>
          <br></br>
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className={classes.transparent_button}
              style={{ marginRight: "50px" }}
              onClick={likeHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-heart"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                role="button"
                fill={like ? "red" : "none"}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
              </svg>
            </button>
            <button className={classes.transparent_button}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-message-circle"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                role="button"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
              </svg>
            </button>
          </div>
          <br></br>
          <div className={classes.or}></div>
          <br></br>




        </div>
      )}
    </div>
  );
};

export default Testdetailedpost;