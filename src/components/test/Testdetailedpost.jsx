import { useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import classes from "./Testdetailedpost.module.css";
import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc, collection } from "firebase/firestore";
import Modal from "./Modal";
import AddCommentToComment from "./AddCommentToComment";

const RenderTree = ({ id, respondee, setParent, setShow }) => {
  const [commentLike, setCommentLike] = useState(false);
  const [comment, setComment] = useState({});

  // const comment = {}

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
    },[id]);

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
    setShow(true);
  };

  return (
    <div>
      <br></br>
      {comment && (
        <div>
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
              <button
                className={classes.transparent_button}
                style={{ marginRight: "20px" }}
                onClick={likeCommentHandler}
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
                  fill={commentLike ? "red" : "none"}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </button>
              <button
                className={classes.transparent_button}
                onClick={onClickHandler}
              >
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
          </div>
          <p>{comment.text}</p>
          <div className={classes.or}></div>
          {comment.sons &&
            comment.sons.map((son) =>
            <RenderTree
            id={son}
            respondee={comment.name}
            setParent={setParent}
            setShow={setShow}
          />
            )}
        </div>
      )}
    </div>
  );
};

const Testdetailedpost = () => {
  const { state } = useLocation();
  const [like, setLike] = useState(false);
  const [show, setShow] = useState(false);
  const [parent, setParent] = useState("");
  const [post, setPost] = useState({});

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

  const commentHandler = () => {};

  return (
    <div>
      {show && (
        <Modal onClose={hideModal}>
          <AddCommentToComment parentid={parent} onClose={hideModal}/>
        </Modal>
      )}
      {post && (
        <div className={classes.post}>
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
            <button
              className={classes.transparent_button}
              onClick={commentHandler}
            >
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
          {post.sons &&
            post.sons.map((son) => (
              <RenderTree
                id={son}
                respondee={post.name}
                setParent={setParent}
                setShow={setShow}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Testdetailedpost;
