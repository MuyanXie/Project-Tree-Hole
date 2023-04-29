import Header from "./Header";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import PostCard from "../posts/PostCard";
import classes from "./Involvement.module.css";

const Involvement = () => {
  const [posts, setPosts] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const getPostID = async () => {
      const q = query(
        collection(db, "involvement"),
        where("uid", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      await setPosts(querySnapshot.docs[0].data().involved);
    };
    getPostID()
  }, []);

  useEffect(() => {
    const getData = async () => {
      const temp_res = [];
      for (let i = 0; i < posts.length; i++) {
        await getDoc(doc(collection(db, "posts"), posts[i])).then((temp) => {
          temp_res.push({id: temp.id, ...temp.data()});
        })
      }
      await setResults(temp_res);
    };
    getData();
  }, [posts]);


  return (
    <div>
      <Header name="Involved Posts" />
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
        <h1>Posts you commented before</h1>
      </div>
      <div className={classes.posts}>
        {results.map((post) => (
          <div key={post.time}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Involvement;
