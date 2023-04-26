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
import MyPosts from "./components/posts/MyPosts";
import PostDetail from "./components/posts/PostDetail";
import Searchresultpage from "./components/utils/Searchresultpage";
import Profile from "./components/display/Profile";
import About from "./components/display/About";
import Dialog from "./components/message/Dialog";
import ChatList from "./components/message/ChatList";
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
          path="/myposts"
          element={
            user ? (
              user.emailVerified ? (
                <MyPosts />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/signin"
          element={
            !user ? (
              <SignIn />
            ) : user.emailVerified ? (
              <Navigate to="/myposts" />
            ) : (
              <Navigate to="/verifyemail" />
            )
          }
        />

        <Route path="/signout" element={<SignOut />} />

        <Route
          path="/signup"
          element={
            !user ? (
              <SignUp />
            ) : user.emailVerified ? (
              <Navigate to="/myposts" />
            ) : (
              <Navigate to="/verifyemail" />
            )
          }
        />

        <Route
          path="/verifyemail"
          element={
            !user ? (
              <Navigate to="/signin" />
            ) : user.emailVerified ? (
              <Navigate to="/myposts" />
            ) : (
              <VerifyEmail />
            )
          }
        />

        <Route
          path="/searchresultpage"
          element={
            user ? (
              user.emailVerified ? (
                <Searchresultpage />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/profile"
          element={
            user ? (
              user.emailVerified ? (
                <Profile />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/"
          element={
            user ? (
              user.emailVerified ? (
                <Navigate to="/myposts" />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />

        <Route
          path="/dialog"
          element={
            user ? (
              user.emailVerified ? (
                <Dialog />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/chatlist"
          element={
            user ? (
              user.emailVerified ? (
                <ChatList />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />

        <Route
          path="/postdetail"
          element={
            user ? (
              user.emailVerified ? (
                <PostDetail />
              ) : (
                <Navigate to="/verifyemail" />
              )
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
