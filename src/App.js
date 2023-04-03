import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AddComment from './components/test/AddComment';
import VerifyEmail from './components/auth/VerifyEmail';
import SignOut from './components/auth/SignOut';
import Test from './components/test/Test';
import { auth } from './firebase';

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
        <Route path="/test" element={user && user.emailVerified ? <Test user={user} /> : <Navigate to="/signin" />} />
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/test" />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/test" />} />
        <Route path="/verifyemail" element={user && !user.emailVerified ? <VerifyEmail /> : <Navigate to="/test" />} />
        <Route path="/addcomment" element={<AddComment />} />
      </Routes>
    </Router>
  )
}

export default App;
