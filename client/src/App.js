import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext'; // Import the SocketProvider

function App() {
  return (
    <SocketProvider>
      <>
        <Toaster /> {/* Toast notifications */}
        <main>
          <Outlet /> {/* Renders the matched child route */}
        </main>
      </>
    </SocketProvider>
  );
}

export default App;
