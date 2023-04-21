import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import "./App.css";
import React from "react";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import VerifyEmail from "./components/auth/VerifyEmail";
import SignOut from "./components/auth/SignOut";
import Test from "./components/test/Test";
import Testgetposts from "./components/test/Testgetposts";
import Testdetailedpost from "./components/test/Testdetailedpost";
import Searchresultpage from "./components/utils/Searchresultpage";
import Profile from "./components/display/Profile";
import { auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/test"
          element={
            user && user.emailVerified ? (
              <Test user={user} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/signin"
          element={!user ? <SignIn /> : <Navigate to="/test" />}
        />
        <Route path="/signout" element={<SignOut />} />
        <Route
          path="/signup"
          element={!user ? <SignUp /> : <Navigate to="/test" />}
        />
        <Route
          path="/verifyemail"
          element={
            user && !user.emailVerified ? (
              <VerifyEmail />
            ) : (
              <Navigate to="/test" />
            )
          }
        />
        <Route path="/testgetposts" element={<Testgetposts />} />
        <Route path="/testdetailedpost" element={<Testdetailedpost />} />
        <Route path="/searchresultpage" element={<Searchresultpage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
