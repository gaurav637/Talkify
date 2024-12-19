import React from 'react';
import logo from '/Users/sudhanshubhardwaj/Desktop/chatApp/client/src/assets /logo.png';

const AuthLayouts = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-50 via-blue-100 to-indigo-50">
      {/* Header Section */}
      <header className="flex justify-center items-center py-6 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
        <img
          src={logo}
          alt="Talkify Logo"
          className="h-24 w-auto object-contain mx-4"
        />
      </header>

      {/* Content Section */}
      <main className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg border border-indigo-100">
          {children}
        </div>
      </main>

      {/* Footer Section */}
      <footer className="text-center py-4 text-sm bg-indigo-500 text-white">
        &copy; 2024 Talkify. Developed by <span className="font-bold">@Gaurav Negi</span>.
      </footer>
    </div>
  );
};

export default AuthLayouts;
