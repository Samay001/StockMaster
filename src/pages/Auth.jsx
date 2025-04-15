import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/authContext'; 

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const { login, register, loading, error } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsRegister(prev => !prev);
    setFormData({ username: '', email: '', password: '' });
  };

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (isRegister) {
        const result = await register(formData);
        if (result.success) {
          alert('Registration successful! Please log in.');
          setIsRegister(false);
          setFormData({ username: '', email: '', password: '' });
        } else {
          alert(result.error || 'Registration failed. Please try again.');
        }
      } else {
        const result = await login({
          username: formData.username,
          password: formData.password
        });
        
        if (result.success) {
          alert('Login successful!');
          navigate('/'); // Redirect to home page
        } else {
          alert(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isRegister ? 'Register' : 'Login'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            disabled={loading}
          />

          {isRegister && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              disabled={loading}
            />
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
            disabled={loading}
          >
            {loading 
              ? 'Processing...' 
              : (isRegister ? 'Register' : 'Login')
            }
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 ml-1 hover:underline"
            disabled={loading}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;