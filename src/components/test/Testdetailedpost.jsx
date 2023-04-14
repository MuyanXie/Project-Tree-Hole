import { useContext, useEffect } from 'react';
import { DetailsContext } from './Testdisplaypost.jsx';

const Testdetailedpost = () => {
  const details = useContext(DetailsContext);

  useEffect(() => {
    console.log(details);
  }, [details]);

  return (
    <div>
      <p>{details.tree.name}</p>
      <p>{details.tree.text}</p>
    </div>
  );
};

export default Testdetailedpost;
