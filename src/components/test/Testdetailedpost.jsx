import { useLocation } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import classes from "./Testdetailedpost.module.css";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";


// const CommentTree = ({ node }) => {
//   const [commentLike, setCommentLike] = useState(false);
//   // need to display the responder and respondee
//   if (!node) {
//     return null;
//   }

//   const likeCommentHandler = () => {
//     if (node.likes.includes(auth.currentUser.uid)) {
//       node.likes = node.likes.filter((uid) => uid !== auth.currentUser.uid);
//       setCommentLike(false);
//     } else {
//       node.likes.push(auth.currentUser.uid);
//       setCommentLike(true);
//     }

//     const commentref = doc(db, "comments", node.id);
//     updateDoc(commentref, {
//       likes: node.likes,
//     });
//   };

//   return (
//     <div>
//       <h2>{node.name}</h2>
//       <p>{node.text}</p>
//       <button
//         className={classes.transparent_button}
//         style={{ marginRight: "50px" }}
//         onClick={likeCommentHandler}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           class="icon icon-tabler icon-tabler-heart"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           stroke-width="2"
//           stroke="currentColor"
//           stroke-linecap="round"
//           stroke-linejoin="round"
//           role="button"
//           fill={commentLike ? "red" : "none"}
//         >
//           <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//           <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
//         </svg>
//       </button>
//       {node.children && node.children.map((child) => (
//         <CommentTree key={child.id} node={child} />
//       ))}
//     </div>
//   );
// };

const Testdetailedpost = () => {
  const { state } = useLocation();
  const [like, setLike] = useState(false);

  useEffect(() => {
    // if the currentuser's uid is in the state.likes list, then set like to true
    if (state.likes.includes(auth.currentUser.uid)) {
      setLike(true);
    }
  }, [state]);

  const RenderTree = (node) => {
    const [commentLike, setCommentLike] = useState(node.likes.includes(auth.currentUser.uid));
    // need to display the responder and respondee
    if (!node) {
      return null;
    }
  
    const likeCommentHandler = () => {
      if (node.likes.includes(auth.currentUser.uid)) {
        node.likes = node.likes.filter(
          (uid) => uid !== auth.currentUser.uid
        );
        setCommentLike(false);
      } else {
        node.likes.push(auth.currentUser.uid);
        setCommentLike(true);
      }
  
      const commentref = doc(db, "comments", node.id);
      updateDoc(commentref, {
        likes: node.likes,
      });
    };
  
    return (
      <div>
        <h2>{node.name}</h2>
        <p>{node.text}</p>
        <button
              className={classes.transparent_button}
              style={{ marginRight: "50px" }}
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
        {node.children && node.children.map((child) => RenderTree(child))}
      </div>
    );
  };

  const likeHandler = () => {
    if(like){
      setLike(false);
      state.likes = state.likes.filter((uid) => uid !== auth.currentUser.uid);
    }else{
      setLike(true);
      state.likes.push(auth.currentUser.uid);
    }
    const postref = doc(db, "posts", state.id);
    updateDoc(postref, {
      likes: state.likes,
    });
  };

  // need to handle comment

  return (
    <div>
      {state && (
        <div className={classes.post}>
          <div style={{ display: "flex", justifyContent : "space-between", alignItems : "center"}}>
            <p
              className={classes.author}
            >
              From: {state.name}
            </p>
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
          {state.children && state.children.map((child) => RenderTree(child))}
        </div>
      )}
    </div>
  );
};

export default Testdetailedpost;


