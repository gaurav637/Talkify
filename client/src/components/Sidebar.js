import React, { useEffect, useState } from 'react';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from './SearchUser';
import { FaImage, FaVideo } from "react-icons/fa6";
import { logout } from '../redux/userSlice';

const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state?.user?.socketConnection);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);

            socketConnection.on('conversation', (data) => {
                const conversationUserData = data.map((conversationUser) => {
                    return {
                        ...conversationUser,
                        userDetails: conversationUser?.sender?._id !== user?._id
                            ? conversationUser.sender
                            : conversationUser.receiver
                    };
                });
                setAllUser(conversationUserData);
            });
        }
    }, [socketConnection, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/email");
        localStorage.clear();
    };

    return (
        <div className="w-full h-full grid grid-cols-[60px,1fr] bg-white shadow-lg">
            {/* Sidebar Navigation */}
            <div className="bg-gray-100 h-full flex flex-col justify-between items-center py-4 rounded-tr-lg rounded-br-lg">
                <div className="flex flex-col gap-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded ${isActive && "bg-gray-200"}`}
                        title="Chat"
                    >
                        <IoChatbubbleEllipses size={22} className="text-gray-600" />
                    </NavLink>
                    <button
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded"
                        onClick={() => setOpenSearchUser(true)}
                        title="Add Friend"
                    >
                        <FaUserPlus size={22} className="text-gray-600" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => setEditUserOpen(true)}
                        className="cursor-pointer hover:opacity-90"
                        title={user?.name}
                    >
                        <Avatar
                            width={44}
                            height={44}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-200 rounded"
                        title="Logout"
                    >
                        <BiLogOut size={22} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex flex-col h-full overflow-hidden">
                <header className="h-16 flex items-center px-6 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
                </header>
                <div className="h-[calc(100vh-80px)] overflow-y-auto bg-gray-50 p-4 space-y-3">
                    {
                        allUser.length === 0 ? (
                            <div className="flex flex-col items-center text-center mt-12 text-gray-500">
                                <FiArrowUpLeft size={50} className="mb-4" />
                                <p className="text-lg">Explore users to start a conversation with.</p>
                            </div>
                        ) : (
                            allUser.map((conv, index) => (
                                <NavLink
                                    key={conv?._id}
                                    to={`/${conv?.userDetails?._id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-100 transition duration-200"
                                >
                                    <Avatar
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={conv?.userDetails?.name}
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800 truncate">{conv?.userDetails?.name}</h3>
                                        <div className="flex items-center gap-1 text-gray-500 text-sm">
                                            {
                                                conv?.lastMsg?.imageUrl && (
                                                    <div className="flex items-center gap-1">
                                                        <FaImage size={14} />
                                                        {!conv?.lastMsg?.text && <span>Image</span>}
                                                    </div>
                                                )
                                            }
                                            {
                                                conv?.lastMsg?.videoUrl && (
                                                    <div className="flex items-center gap-1">
                                                        <FaVideo size={14} />
                                                        {!conv?.lastMsg?.text && <span>Video</span>}
                                                    </div>
                                                )
                                            }
                                            <p className="truncate">{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {
                                        Boolean(conv?.unseenMsg) && (
                                            <span className="ml-auto w-6 h-6 flex justify-center items-center bg-primary text-white text-xs font-semibold rounded-full">
                                                {conv?.unseenMsg}
                                            </span>
                                        )
                                    }
                                </NavLink>
                            ))
                        )
                    }
                </div>
            </div>

            {/* Edit User Details Modal */}
            {editUserOpen && (
                <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
            )}

            {/* Search User Modal */}
            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}
        </div>
    );
};

export default Sidebar;
