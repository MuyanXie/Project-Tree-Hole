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
        name: post.poster,
        text: post.text,
        deleted: post.deleted,
        anonymous: post.anonymous,
        children: [],
        sons: post.sons,
        time: post.time,
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
        );
        const comments = commentDocs.map((doc) => doc.data());
        if (!comments) {
          return;
        }
        comments.forEach((comment) => {
          const node = {
            name: comment.poster,
            text: comment.text,
            sons: comment.sons,
            time: comment.time,
            children: [],
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
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
        </div>
      ))}

      {trees.map((tree) => (
        <div key={tree.id}>
          <p>{tree.text}</p>
          <Testdisplaypost tree={tree} />
        </div>
      ))}
    </div>
  );
};

export default Testgetposts;
