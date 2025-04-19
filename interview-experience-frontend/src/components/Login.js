import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = "https://inter-experience.onrender.com"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setMessage('Login successful!');
      navigate('/submissions');
    } else {
      setError(data.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setMessage('Logged out');
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />

        <div className="flex justify-between gap-4 mb-4">
          <button
            onClick={handleLogin}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Login
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Logout
          </button>
        </div>

        {message && <p className="text-center text-lg text-gray-700 mt-4">{message}</p>}
        {error && <p className="text-center text-red-500 mt-4 text-lg">{error}</p>}

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
