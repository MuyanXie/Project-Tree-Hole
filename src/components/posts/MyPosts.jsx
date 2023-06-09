import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import PostCard from "./PostCard";
import classes from "./MyPosts.module.css";
import Header from "../display/Header";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", currentUser.uid),
        orderBy("time", "desc")
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

  return (
    <div>
      <Header name="My Posts" />
      <div
        style={{
          alignItems: "center",
          margin: "auto",
          justifyContent: "center",
          padding: "5px",
          display: "block",
          textAlign: "center",
          fontFamily: "sans-serif",  
        }}
      >
        <h1>Your Past Posts</h1>
      </div>
      <div className={classes.posts}>
        {posts.map((post) => (
          <div key={post.time}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPosts;
