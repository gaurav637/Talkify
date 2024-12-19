// src/components/Home.js
import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '/Users/sudhanshubhardwaj/Desktop/chatApp/client/src/assets /logo.png';
import axios from 'axios';
import { setUser, logout } from '../redux/userSlice';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
    });

    return () => {
      socket.off('onlineUser');
    };
  }, [socket, dispatch]);

  const basePath = location.pathname === '/';

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      {/* Sidebar Section with Gradient Background */}
      <section
        className={`bg-gradient-to-r from-blue-50 via-indigo-100 to-blue-200 ${!basePath && 'hidden'} lg:block`}
      >
        <Sidebar />
      </section>

      {/* Main Content Section */}
      <section className={`${basePath && 'hidden'} bg-gradient-to-b from-gray-50 to-gray-100`}>
        <Outlet />
      </section>

      {/* Center Content for Select User */}
      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? 'hidden' : 'lg:flex'
        } bg-gradient-to-r from-indigo-50 via-purple-100 to-pink-100`}
      >
        <div>
          <img src={logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">Select user to send message</p>
      </div>
    </div>
  );
};

export default Home;
