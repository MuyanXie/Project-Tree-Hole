import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Testdetailedpost = () => {
  const { state } = useLocation();

  return (
    <div>
      {/* <p>{details.tree.name}</p>
      <p>{details.tree.text}</p> */}
      <p>here</p>
      {state && (
        <div>
          <p>{state.name}</p>
          <p>{state.text}</p>
        </div>
      )}
    </div>
  );
};

export default Testdetailedpost;
