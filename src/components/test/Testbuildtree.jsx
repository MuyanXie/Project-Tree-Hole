// import React, { useEffect, useState } from "react";
// import { auth, db } from "../../firebase";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import { useCallback } from "react";

// const Testbuildtree = useCallback((post) => {
//   console.log("post", post);
//   const buildTree = async (post) => {
//     const rootNode = {
//       name: post.name,
//       text: post.text,
//       deleted: post.deleted,
//       anonymous: post.anonymous,
//       children: [],
//       sons: post.sons,
//       time: post.time,
//       likes: post.likes,
//       id: post.id,
//     };
//     const addComments = async (parent) => {
//       if (!parent.sons) {
//         return;
//       }
//       const commentRefs = parent.sons.map((id) =>
//         doc(collection(db, "comments"), id)
//       );
//       const commentDocs = await Promise.all(
//         commentRefs.map((ref) => getDoc(ref))
//       );
//       const comments = commentDocs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       if (!comments) {
//         return;
//       }
//       comments.forEach((comment) => {
//         const node = {
//           name: comment.name,
//           likes: comment.likes,
//           text: comment.text,
//           sons: comment.sons,
//           time: comment.time,
//           children: [],
//           id: comment.id,
//         };
//         parent.children.push(node);
//         addComments(node);
//       });
//     };
//     addComments(rootNode).then(() => {
//       console.log("rootNode", rootNode);
//       return rootNode;
//     });
//     console.log("rootNode", rootNode);
//     return rootNode;
//   };
// }, []);

// export default Testbuildtree;
