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
import Header from "../display/Header";


const Testgetposts = () => {
  const [posts, setPosts] = useState([]);

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

  return (
    <div>
      <Header />
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
