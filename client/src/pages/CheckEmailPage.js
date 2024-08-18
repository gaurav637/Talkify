import React, { useState } from 'react';
// import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { PiUserCircle } from "react-icons/pi";
import { PulseLoader } from 'react-spinners';

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
      <div className='bg-white shadow-lg rounded-lg p-6 w-full max-w-md mx-auto'>
        <div className='w-fit mx-auto mb-4'>
          <PiUserCircle
            size={80}
            className="text-primary"
          />
        </div>

        <h3 className='text-center text-2xl font-semibold mb-2 text-gray-700'>Welcome to Talkify </h3>
        <p className='text-center text-gray-500 mb-6'>Enter your email to continue</p>

        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='text-gray-600'>Email :</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Enter your email'
              className='bg-gray-100 px-3 py-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200'
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            className={`bg-primary text-lg px-4 py-2 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide flex items-center justify-center transition-all duration-200 ${loading ? 'opacity-70' : ''}`}
            disabled={loading}
          >
            {loading ? <PulseLoader size={8} color={"#fff"} /> : "Let's Go"}
          </button>
        </form>

        <p className='my-4 text-center text-gray-600'>
          New User? <Link to="/register" className='text-primary font-semibold hover:underline'>Register</Link>
        </p>
      </div>
    </div>
  )
}

export default CheckEmailPage;
