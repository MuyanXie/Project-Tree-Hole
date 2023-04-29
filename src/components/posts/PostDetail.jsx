import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import classes from "./PostDetail.module.css";
import { auth, db } from "../../firebase";
import { query, where, getDocs } from "firebase/firestore";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";
import Modal from "./Modal";
import AddComment from "./AddComment";
import Header from "../display/Header";
import {
  IconHeart,
  IconMessageCircle,
  IconMessages,
} from "@tabler/icons-react";

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
        <div style={{ fontFamily: "sans-serif" }}>
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
  const [which, setWhich] = useState("posts");

  const navigate = useNavigate();

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

  const startChatHandler = () => {
    // create the chat object in the database first and get the snapshot reference
    // direct the user to the chat page with the chat id

    const p1 = auth.currentUser.uid.localeCompare(post.uid) < 0 ? auth.currentUser.uid : post.uid;
    const p2 = auth.currentUser.uid.localeCompare(post.uid) < 0 ? post.uid : auth.currentUser.uid;

    const q = query(collection(db, "messages"), where("people", "==", [p1, p2]));

    getDocs(q).then((querySnapshot) => {
      console.log(querySnapshot);
      console.log(querySnapshot.docs.length);
    if (querySnapshot.docs.length > 0) {
      querySnapshot.forEach((doc) => {
        navigate("/dialog", {
          state: {
            id: doc.id,
            sender: auth.currentUser.uid,
            recipientName: post.name,
            senderName: auth.currentUser.displayName,
          },
        });
      });
    } else {
      addDoc(collection(db, "messages"), {
        last: new Date(),
        recipient: post.uid,
        recipientName: post.name,
        recipientUnread: true,
        sender: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        senderUnread: false,
        people: [p1, p2],
      }).then((docRef) => {
        addDoc(collection(db, "messages/" + docRef.id + "/chat"), {
          text: "Hi, just came across your post. Can we chat? [automatic greeting]",
          date: new Date(),
          sender: auth.currentUser.uid,
        })
          .then(() => {
            addDoc(collection(db, "contacts"), {
              people: [auth.currentUser.uid, post.uid],
            });
          })
          .then(() => {
            navigate("/dialog", {
              state: {
                id: docRef.id,
                sender: auth.currentUser.uid,
                recipientName: post.name,
                senderName: auth.currentUser.displayName,
              },
            });
          });
      });
    }
  });
  };

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
          <AddComment parentid={parent} onClose={hideModal} which={which} superparentid={post.id} />
        </Modal>
      )}
      {!show && <Header name="Post Details" />}
      {post && (
        <div className={classes.post} style={{ fontFamily: "sans-serif" }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <IconHeart
              fill={like ? "red" : "none"}
              role="button"
              onClick={likeHandler}
              style={{ marginRight: "20px" }}
            />
            <IconMessageCircle
              style={{
                marginRight: "20px",
              }}
              role="button"
              onClick={commentHandler}
            />
            <IconMessages role="button" onClick={startChatHandler} />
          </div>

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
