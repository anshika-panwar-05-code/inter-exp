import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Submissions from './components/Submissions';
import SubmitExperience from './components/SubmitExperience';
import Footer from './components/Footer'; // Import the Footer component
import './App.css'; // Import your CSS file for global styles

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/submissions" element={<Submissions />} />
            <Route path="/submit-experience" element={<SubmitExperience />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
