import { createContext, useState } from "react";
import classes from "./Testdisplaypost.module.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const DetailsContext = createContext({});

const Testdisplaypost = (tree) => {
  const [details, setDetails] = useState({});
  const navigate = useNavigate();

  const load = () => {
    console.log("clicked");
    console.log(tree);
    setDetails(tree);
    navigate("/testdetailedpost");
  };

  return (
    <div>
      <div className={classes.post}>
        <p className={classes.author}>From : {tree.tree.name}</p>
        <div className={classes.or}></div>
        <br></br>
        <p className={classes.text}>{tree.tree.text}</p>
        <div className={classes.or}></div>
        <br></br>
        <DetailsContext.Provider value={details}>
          <Button variant="light" onClick={() => load()}>
            Details
          </Button>
        </DetailsContext.Provider>
      </div>
    </div>
  );
};

export default Testdisplaypost;
export { DetailsContext };
