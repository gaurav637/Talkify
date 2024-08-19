import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setSocketConnection } from '../redux/userSlice'; 

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch(); 

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const token = localStorage.getItem('token');

    console.log('Backend URL:', backendUrl);
    console.log('Token:', token);

    if (backendUrl && token) {
      const socketConnection = io(backendUrl, {
        auth: { token },
      });

      socketConnection.on('connect', () => {
        console.log('Socket connected:', socketConnection.id);
      });

      socketConnection.on('connect_error', (err) => {
        console.error('Connection Error:', err);
      });

      setSocket(socketConnection);
      dispatch(setSocketConnection(socketConnection)); 

      return () => {
        socketConnection.disconnect();
      };
    } else {
      console.error('Missing backend URL or token');
    }
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
