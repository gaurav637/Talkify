import React from 'react';
import logo from '/Users/sudhanshubhardwaj/Desktop/chatApp/client/src/assets /logo.png';

const AuthLayouts = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <header className="flex justify-center items-center py-4 bg-white shadow-md">
        <img
          src={logo}
          alt="Talkify Logo"
          className="h-24 w-auto object-contain mx-4" // Increased height and added padding
        />
      </header>

      {/* Content Section */}
      <main className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; 2024 Talkify. Developed by @Gaurav Negi.
      </footer>
    </div>
  );
};

export default AuthLayouts;
