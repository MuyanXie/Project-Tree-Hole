import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';
import React from 'react';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Display from './components/display/Display';
import AddComment from './components/display/AddComment';
import VerifyEmail from './components/auth/VerifyEmail';
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
    // <Router>
    //   <Routes>
    //     <Route path="/signin" element={<SignIn />} />
    //     <Route path="/signup" element={<SignUp />} />
    //     <Route path="/display" element={<Display />} />
    //     <Route path="/addcomment" element={<AddComment />} />
    //     <Route path="/verifyemail" element={<VerifyEmail />} />
    //     <Route path='/test' element={<Test />} />
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
      <Route path="/test" element={user && user.emailVerified ? <Test user={user} /> : <Navigate to="/signin" />} />
      <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/test" />} />
      </Routes>
    </Router>
  )
}

export default App;
