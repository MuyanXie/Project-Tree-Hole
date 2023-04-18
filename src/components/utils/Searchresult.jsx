import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {query, collection, where, getDocs} from "firebase/firestore";
import Testdisplaypost from "../test/Testdisplaypost";

const Searchresult = (content) => {
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log(content.content);
    const getresult = async () => {
      const q = query(
        collection(db, "posts")
        ,where('text', '>=', content.content)
        ,where('text', '<=', content.content+'z')
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot)
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
      console.log(results);
    };
    getresult().then(() => console.log(searchResults));
  }, [content.content]);

  return (
    // <p>{content}</p>
    <div>
      <p>{content.content}</p>
      {searchResults && 
        searchResults.map((result) => (
            <div key={result.time}>
                <Testdisplaypost post={result} />
            </div>
        ))
      }
    </div>

  );
};

export default Searchresult;
