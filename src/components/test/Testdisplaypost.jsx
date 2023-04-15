import classes from "./Testdisplaypost.module.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const Testdisplaypost = (tree) => {
  const navigate = useNavigate();

  const load = () => {
    navigate("/testdetailedpost", { state: tree.tree });
  };

  return (
    <div>
      <div className={classes.post}>
        <p className={classes.author}>From : {tree.tree.name}</p>
        <div className={classes.or}></div>
        <br></br>
        <p className={classes.text}>{tree.tree.text}</p>
        <br></br>  
        <div className={classes.or}></div>
        <br></br>
          <Button variant="light" onClick={() => load()}>
            Details
          </Button>
      </div>
    </div>
  );
};

export default Testdisplaypost;
