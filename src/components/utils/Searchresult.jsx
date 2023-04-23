import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {query, collection, where, getDocs} from "firebase/firestore";
import PostCard from "../posts/PostCard";

const Searchresult = (content) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const getresult = async () => {
      const q = query(
        collection(db, "posts")
        ,where('text', '>=', content.content)
        ,where('text', '<=', content.content+'z')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    };
    getresult()
  }, [content.content]);

  return (
    // <p>{content}</p>
    <div>
      <p>{content.content}</p>
      {searchResults && 
        searchResults.map((result) => (
            <div key={result.time}>
                <PostCard post={result} />
            </div>
        ))
      }
    </div>

  );
};

export default Searchresult;
