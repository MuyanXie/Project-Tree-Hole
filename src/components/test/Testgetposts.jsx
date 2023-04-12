import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, query, where, getDocs} from 'firebase/firestore';

const Testgetposts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const q = query(collection(db, 'posts'), where('uid', '==', currentUser.uid));
      const getData = async () => {
        const querySnapshot = await getDocs(q);
        setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      //document id is stored in doc.id
      };
      getData();
    }
  }, []);
  

  return (
    <div>
      <h1>My Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.text}</p>
          <p>{post.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Testgetposts;
