import classes from "./PostCard.module.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const PostCard = (post) => {
  const navigate = useNavigate();

  const load = () => {
    navigate("/postdetail", { state: post.post.id });
  };

  return (
    <div>
      <div className={classes.post}>
        <p className={classes.author}>From : {post.post.name}</p>
        <div className={classes.or}></div>
        <br></br>
        <p className={classes.text}>{post.post.text}</p>
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

export default PostCard;
