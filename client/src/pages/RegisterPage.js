// RegisterPage.jsx
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For animations
import uploadFile from '../helpers/uploadFile'; // Replace with your file upload helper function
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: '',
  });
  const [uploadPhoto, setUploadPhoto] = useState('');
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file); // Simulated file upload logic
    setUploadPhoto(file);

    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url || '',
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          name: '',
          email: '',
          password: '',
          profile_pic: '',
        });
        navigate('/email');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gradient-to-r from-white via-blue-100 to-blue-50 shadow-lg rounded-lg p-6 w-full max-w-md"
  >
    <h2 className="text-2xl font-bold text-center text-gray-700">
      Welcome to Talkify
    </h2>
    <p className="text-sm text-center text-gray-500">
      Register to start your journey with us!
    </p>

        <form className="space-y-5 mt-5" onSubmit={handleSubmit}>
          {/* Name Field */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <label htmlFor="name" className="text-gray-600">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="px-3 py-2 border rounded focus:outline-indigo-500"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </motion.div>

          {/* Email Field */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <label htmlFor="email" className="text-gray-600">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="px-3 py-2 border rounded focus:outline-indigo-500"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            <label htmlFor="password" className="text-gray-600">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="px-3 py-2 border rounded focus:outline-indigo-500"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </motion.div>

          {/* Profile Photo Upload */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            <label htmlFor="profile_pic" className="text-gray-600">
              Profile Photo:
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="profile_pic"
                name="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
              />
              <div className="bg-gray-100 px-3 py-2 border rounded flex items-center justify-between w-full">
                <p className="truncate">
                  {uploadPhoto?.name || 'Upload your profile photo'}
                </p>
                {uploadPhoto?.name && (
                  <button
                    type="button"
                    onClick={handleClearUploadPhoto}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
          >
            Register
          </motion.button>
        </form>

        <p className="text-center text-gray-500 mt-3">
          Already have an account?{' '}
          <Link to="/email" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
