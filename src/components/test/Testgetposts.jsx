import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Testdisplaypost from "./Testdisplaypost";
import classes from "./Testgetposts.module.css";


const Testgetposts = () => {
  const [posts, setPosts] = useState([]);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", currentUser.uid)
      );
      const getData = async () => {
        const querySnapshot = await getDocs(q);
        console.log("querySnapshot", querySnapshot.docs);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        await setPosts(data);
      };
      getData();
    }
  }, []);

  useEffect(() => {
    const buildTree = async (post) => {
      const rootNode = {
        name: post.name,
        text: post.text,
        deleted: post.deleted,
        anonymous: post.anonymous,
        children: [],
        sons: post.sons,
        time: post.time,
        likes: post.likes,
        id: post.id,
      };
      const addComments = async (parent) => {
        if (!parent.sons) {
          return;
        }
        const commentRefs = parent.sons.map((id) =>
          doc(collection(db, "comments"), id)
        );
        const commentDocs = await Promise.all(
          commentRefs.map((ref) => getDoc(ref))
        ).then((commentDocs) => {
          console.log("commentDocs", commentDocs);
        });
        const comments = commentDocs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (!comments) {
          return;
        }
        comments.forEach((comment) => {
          const node = {
            name: comment.name,
            likes: comment.likes,
            text: comment.text,
            sons: comment.sons,
            time: comment.time,
            children: [],
            id: comment.id,
          };
          parent.children.push(node);
          addComments(node);
        });
      };
      addComments(rootNode).then(() => {
        return rootNode;
      });
      return rootNode;
    };

    async function getTrees() {
      const locals = [];
      for (const post of posts) {
        buildTree(post)
          .then((tree) => locals.push(tree))
          .then(() => {
            setTrees(locals);
          });
      }
    }

    if (posts.length > 0) {
      getTrees();
    }

  }, [posts]);

  return (
    <div>
      <h1>My Posts</h1>

      <div className={classes.posts}>
        {posts.map((post) => (
          <div key={post.time}>
            <Testdisplaypost post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testgetposts;
