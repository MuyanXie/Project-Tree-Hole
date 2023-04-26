import React from "react";
import Header from "./Header";
import background from "../../static/pics/UChicago_Dusk.jpeg";
import classes from "./About.module.css";

const About = () => {
  return (
    <div>
      <Header name={"About"} />
      <div>
        <img
          src={background}
          alt="UChicago Dusk"
          width={"100%"}
          height={"100%"}
          style={{ position: "relative", zIndex: "-1" }}
        />
        <div
          style={{
            zIndex: "1",
            left: "50%",
            padding: "5px",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            position: "absolute",
          }}
          className={classes.block}
        >
          <h1 style={{ fontSize: "xxx-large", fontFamily: "sans-serif" }}>
            University of Chicago Tree Hole
          </h1>
          <h5 style={{ alignItems: "center", fontSize: "xx-large", fontFamily: "sans-serif" }}>
            Honorly built by the UChicago Tree Hole Team
          </h5>
          <br></br>
          <h5 style={{ alignItems: "center", fontSize: "xx-large", fontFamily: "sans-serif"
        }}>
            "We are here to listen and to find the way out"
          </h5>
        </div>
      </div>
    </div>
  );
};

export default About;
