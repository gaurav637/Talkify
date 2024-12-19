import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const UserSearchCard = ({ user, onClose }) => {
  return (
    // Card container with hover effect and smooth transition
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-primary rounded cursor-pointer transition duration-300 ease-in-out transform hover:scale-105'
    >
      {/* Avatar Container */}
      <div>
        <Avatar
          width={50}
          height={50}
          name={user?.name}
          userId={user?._id}
          imageUrl={user?.profile_pic}
        />
      </div>
      
      {/* Text Content Container */}
      <div>
        {/* User's Name */}
        <div className='font-semibold text-lg text-gray-900 text-ellipsis line-clamp-1'>
          {user?.name}
        </div>
        
        {/* User's Email */}
        <p className='text-sm text-gray-600 text-ellipsis line-clamp-1'>{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
