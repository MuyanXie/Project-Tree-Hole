import { useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import classes from "./PostDetail.module.css";
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc, collection } from "firebase/firestore";
import Modal from "./Modal";
import AddComment from "./AddComment";
import Header from "../display/Header";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";

const RenderTree = ({ id, respondee, setParent, setShow, setWhich }) => {
  const [commentLike, setCommentLike] = useState(false);
  const [comment, setComment] = useState({});

  useEffect(() => {
    const collectionRef = collection(db, "comments");
    const docRef = doc(collectionRef, id);
    const getComment = async () => {
      const docSnap = await getDoc(docRef);
      const data = {
        ...docSnap.data(),
        id: docSnap.id,
      };
      await setComment(data);
      if (data.likes.includes(auth.currentUser.uid)) {
        await setCommentLike(true);
      }
    };
    getComment();
  }, [id]);

  const likeCommentHandler = () => {
    if (comment.likes.includes(auth.currentUser.uid)) {
      comment.likes = comment.likes.filter(
        (uid) => uid !== auth.currentUser.uid
      );
      setCommentLike(false);
    } else {
      comment.likes.push(auth.currentUser.uid);
      setCommentLike(true);
    }

    const commentref = doc(db, "comments", id);
    updateDoc(commentref, {
      likes: comment.likes,
    });
  };

  const onClickHandler = () => {
    setParent(id);
    setWhich("comment");
    setShow(true);
  };

  return (
    <div>
      <br></br>
      {comment && (
        <div style={{fontFamily:"sans-serif"}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h6>
              {comment.name} responds to {respondee}
            </h6>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconHeart
                fill={commentLike ? "red" : "none"}
                role="button"
                onClick={likeCommentHandler}
                style={{ marginRight: "20px" }}
              />
              <IconMessageCircle role="button" onClick={onClickHandler} />
            </div>
          </div>
          <p>{comment.text}</p>
          <div className={classes.or}></div>
          {comment.sons &&
            comment.sons.map((son) => (
              <RenderTree
                id={son}
                respondee={comment.name}
                setParent={setParent}
                setShow={setShow}
                setWhich={setWhich}
              />
            ))}
        </div>
      )}
    </div>
  );
};

const PostDetail = () => {
  const { state } = useLocation();
  const [like, setLike] = useState(false);
  const [show, setShow] = useState(false);
  const [parent, setParent] = useState("");
  const [post, setPost] = useState({});
  const [which, setWhich] = useState("post");

  const hideModal = () => {
    setShow(false);
  };

  useEffect(() => {
    //get the post object from the database
    const collectionRef = collection(db, "posts");
    const docRef = doc(collectionRef, state);
    const getData = async () => {
      const docSnap = await getDoc(docRef);
      const data = {
        ...docSnap.data(),
        id: docSnap.id,
      };
      await setPost(data);
      if (data.likes.includes(auth.currentUser.uid)) {
        await setLike(true);
      }
    };
    getData();
  }, [state]);

  const likeHandler = () => {
    if (like) {
      setLike(false);
      post.likes = post.likes.filter((uid) => uid !== auth.currentUser.uid);
    } else {
      setLike(true);
      post.likes.push(auth.currentUser.uid);
    }
    const postref = doc(db, "posts", post.id);
    updateDoc(postref, {
      likes: post.likes,
    });
  };

  const commentHandler = () => {
    setParent(post.id);
    setShow(true);
  };

  return (
    <div>
      {show && (
        <Modal>
          <AddComment
            parentid={parent}
            onClose={hideModal}
            which={which}
          />
        </Modal>
      )}
      {!show && <Header name = "Post Details"/>}

      {post && (
        <div className={classes.post} style={{fontFamily:"sans-serif"}}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p className={classes.author}>From: {post.name}</p>
            <Badge bg="info">Certified</Badge>
          </div>

          <div className={classes.or}></div>
          <br></br>
          <p className={classes.text}>{post.text}</p>
          <br></br>
          <div className={classes.or}></div>
          <br></br>
          <div style={{ display: "flex", alignItems: "center" }}>
              <IconHeart
                fill={like ? "red" : "none"}
                role="button"
                onClick={likeHandler}
                style={{ marginRight: "20px" }}
              />
              <IconMessageCircle role="button" onClick={commentHandler} />
            </div>
          <br></br>
          <div className={classes.or}></div>
          {post.sons &&
            post.sons.map((son) => (
              <RenderTree
                id={son}
                respondee={post.name}
                setParent={setParent}
                setWhich={setWhich}
                setShow={setShow}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
