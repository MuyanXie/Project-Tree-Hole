import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const Testgetposts = () => {
  const [posts, setPosts] = useState([]);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(collection(db, 'posts'), where('uid', '==', currentUser.uid));
      const getData = async () => {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        children: [],
        sons: post.sons,
      };
      console.log(rootNode);
      const addComments = async (parent) => {
        if (!parent.sons) {
          return;
        }
        const commentRefs = parent.sons.map((id) => doc(collection(db, "comments"), id));
        const commentDocs = await Promise.all(commentRefs.map((ref) => getDoc(ref)));
        const comments = commentDocs.map((doc) => doc.data());
        if (!comments) {
          return;
        }
        comments.forEach((comment) => {
          const node = {
            name: comment.poster,
            text: comment.text,
            sons: comment.sons,
            children: [],
          };
          parent.children.push(node);
          addComments(node);
        });
      };
      addComments(rootNode).then(() => console.log(rootNode)).then(
        () => {
          return rootNode;
        }
      );
    } 

    async function getTrees() {
      const trees = [];
      for (const post of posts) {
        buildTree(post).then((tree) => trees.push(tree));
      }
      setTrees(trees);
    }

    if (posts.length > 0) {
      getTrees().then(() => console.log(trees)).catch((err) => console.log(err));
    }

  }, [posts]);

  return (
    <div>
      <h1>My Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <p>{post.id}</p>
          <p>{post.uid}</p>
          <p>{post.sons}</p>
        </div>
      ))}
        {trees.length > 0 && (
          <div>
            {trees.map((tree) => (
              <div key={tree.id}>
                {/* <p>{tree.name}</p> */}
                <p>{tree.text}</p>
                <p>here</p>
              </div>
            ))}
          </div>
        )}

    </div>
  );
};

export default Testgetposts;
