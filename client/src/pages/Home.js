import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { setOnlineUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from '//Users/sudhanshubhardwaj/Desktop/chatApp/client/src/assets /logo.png';
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
    <div className="flex flex-col lg:flex-row h-screen max-h-screen">
      <aside className={`bg-gray-800 text-white ${basePath ? 'block' : 'hidden'} lg:block w-80 p-4 shadow-md`}>
        <Sidebar />
      </aside>

      <main className={`flex-1 ${basePath ? 'flex items-center justify-center' : ''} p-4`}>
        <Outlet />
      </main>

      <div className={`flex flex-col items-center justify-center p-4 ${basePath ? 'flex' : 'hidden'} lg:hidden`}>
        <img src={logo} width={200} alt="logo" className="mb-4" />
        <p className="text-xl text-gray-600">Select a user to start chatting</p>
      </div>
    </div>
  );
};

export default Home;
