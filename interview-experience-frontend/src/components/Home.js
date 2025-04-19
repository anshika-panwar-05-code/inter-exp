import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/submissions');
  };

  const handleSubmitClick = () => {
    navigate('/submit-experience');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content Centered */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-gray-800 tracking-wide">
            Welcome to the Interview Experience Platform!
          </h2>
          <p className="text-xl text-gray-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Discover insights, share your experiences, and help others navigate the interview process.
          </p>
        </div>

        <div className="flex gap-6 mt-10 justify-center flex-wrap">
          <button
            className="py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-lg transform transition-all duration-300 hover:bg-blue-600 hover:scale-105"
            onClick={handleExploreClick}
          >
            Explore Experiences
          </button>
          <button
            className="py-3 px-6 text-lg font-semibold text-white bg-green-500 rounded-full shadow-lg transform transition-all duration-300 hover:bg-green-600 hover:scale-105"
            onClick={handleSubmitClick}
          >
            Share Your Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
