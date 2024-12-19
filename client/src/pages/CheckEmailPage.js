import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;
    setLoading(true);

    try {
      const response = await axios.post(URL, data);
      setLoading(false);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "",
        });
        navigate('/password', {
          state: response?.data?.data
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      {/* Outer container animation */}
      <motion.div
        className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Icon animation */}
        <motion.div
          className='w-fit mx-auto mb-4'
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <PiUserCircle size={80} className="text-primary" />
        </motion.div>

        {/* Title and description animation */}
        <motion.h3
          className='text-center text-2xl font-semibold mb-2 text-gray-700'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome to Talkify
        </motion.h3>
        <motion.p
          className='text-center text-gray-500 mb-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter your email to continue
        </motion.p>

        {/* Form animation */}
        <motion.form
          className='grid gap-4'
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-gray-600'>Email :</label>
            <motion.input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-gray-100 px-3 py-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200'
              value={data.email}
              onChange={handleOnChange}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Button animation */}
          <motion.button
            className={`bg-primary text-lg px-4 py-2 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide flex items-center justify-center transition-all duration-200 ${loading ? 'opacity-70' : ''}`}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? <PulseLoader size={8} color={"#fff"} /> : "Let's Go"}
          </motion.button>
        </motion.form>

        {/* Link animation */}
        <motion.p
          className='my-4 text-center text-gray-600'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          New User? <Link to="/register" className='text-primary font-semibold hover:underline'>Register</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CheckEmailPage;
