import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import PostCard from "../posts/PostCard";
import classes from "./FeedPosts.module.css";
import Header from "../display/Header";

const FeedPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(
        collection(db, "posts"),
        orderBy("time", "desc"),
        limit(20)
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
        <h1>Trending Posts</h1>
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

export default FeedPosts;
