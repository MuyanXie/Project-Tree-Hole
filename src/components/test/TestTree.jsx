import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export default function TestTree(id) {
  const [tree, setTree] = useState({});

  async function buildTree(uid) {
    const postRef = doc(collection(db, "posts"), uid);
    const postDoc = await getDoc(postRef);
    const post = postDoc.data();
    console.log(post);
    const rootNode = {
      name: post.name,
      text: post.text,
      children: [],
    };

    const addComments = async (parent) => {
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
          name: comment.name,
          text: comment.text,
          children: [],
        };
        parent.children.push(node);
        addComments(node);
      });
    };

    await addComments(rootNode);

    return rootNode;
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await buildTree(id);
      console.log(res);
      setTree(res);
    };

    fetchData();
  }, [id]);

  return tree;
}
