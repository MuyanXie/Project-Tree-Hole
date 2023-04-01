import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import React from 'react';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Display from './components/display/Display';
import AddComment from './components/display/AddComment';
import VerifyEmail from './components/auth/VerifyEmail';
import Test from './components/test/test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/display" element={<Display />} />
        <Route path="/addcomment" element={<AddComment />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path='/test' element={<Test />} />
      </Routes>
    </Router>
  )
}

export default App;
