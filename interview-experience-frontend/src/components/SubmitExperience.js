import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitExperience = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to submit your experience.');
      setIsAuthenticated(false);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('You must be logged in to submit.');
      navigate('/login');
      return;
    }

    const questionList = questions.split(',').map((q) => q.trim());
    
    // ✅ Check if the number of questions exceeds 15
    if (questionList.length > 15) {
      setErrorMessage('You can only enter a maximum of 15 questions.');
      return;
    }

    try {
      await axios.post('https://inter-experience.onrender.com/submissions', {
        name,
        country,
        company,
        questions: questionList,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Reset form and display success message
      setIsSubmitted(true);
      setName('');
      setCountry('');
      setCompany('');
      setQuestions('');
      setErrorMessage('Your experience has been successfully submitted.');
    } catch (err) {
      console.error('Error submitting experience:', err);
      if (err.response && err.response.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setErrorMessage('An error occurred while submitting your experience.');
      }
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-xl">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-xl">Please login to submit your experience. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Submit Interview Experience</h2>
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        
        {/* If the experience was successfully submitted, show a success message and reset the form */}
        {isSubmitted ? (
          <div className="text-green-500 text-center mb-4">
            <p>Your experience has been successfully submitted!</p>
            <button 
              onClick={() => setIsSubmitted(false)} 
              className="mt-4 text-blue-500 hover:underline"
            >
              Submit Another Experience
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Interview Questions (comma separated)"
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitExperience;

