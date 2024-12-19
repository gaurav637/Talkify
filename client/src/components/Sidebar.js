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
import { motion } from 'framer-motion';
import { FaStickyNote } from "react-icons/fa";
import NotesModal from './note';
import { FaTasks } from "react-icons/fa"; // Import the task manager icon

const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

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
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full h-full grid grid-cols-[60px,1fr] bg-gray-900 text-white shadow-lg"
        >
            {/* Sidebar Navigation */}
            <div className="bg-gray-800 h-full flex flex-col justify-between items-center py-4 rounded-tr-lg rounded-br-lg">
                <div className="flex flex-col gap-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 rounded ${isActive && "bg-blue-600"}`}
                        title="Chat"
                    >
                        <IoChatbubbleEllipses size={22} className="text-white" />
                    </NavLink>
                    <button
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 rounded"
                        onClick={() => setOpenSearchUser(true)} // Toggle SearchUser modal
                        title="Add Friend"
                    >
                        <FaUserPlus size={22} className="text-white" />
                    </button>
                    {/* Task Manager Icon */}
                    <button
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 rounded"
                        onClick={() => navigate("/task-manager")} // Navigate to Task Manager
                        title="Task Manager"
                    >
                        <FaTasks size={22} className="text-white" />
                    </button>
                    {/* Notes Icon */}
                    <button
                        onClick={() => setIsNotesOpen(true)}
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 rounded"
                        title="Notes"
                    >
                        <FaStickyNote size={22} className="text-white" />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
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
                        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                            {user?.name}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-gray-700 rounded"
                        title="Logout"
                    >
                        <BiLogOut size={22} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex flex-col h-full overflow-hidden">
                <header className="h-16 flex items-center px-6 bg-gray-800 shadow-md">
                    <h2 className="text-2xl font-bold text-white font-poppins tracking-tight">
                        Messages
                    </h2>
                </header>
                <motion.div
                    className="h-[calc(100vh-80px)] overflow-y-auto bg-gray-900 p-4 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {allUser.length === 0 ? (
                        <motion.div
                            className="flex flex-col items-center text-center mt-12 text-gray-300"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FiArrowUpLeft size={50} className="mb-4 text-gray-500" />
                            <p className="text-lg">Explore users to start a conversation with.</p>
                        </motion.div>
                    ) : (
                        allUser.map((conv, index) => (
                            <motion.div
                                key={conv?._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <NavLink
                                    to={`/${conv?.userDetails?._id}`}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-blue-600 transition-all duration-200 hover:shadow-md"
                                >
                                    <Avatar
                                        imageUrl={conv?.userDetails?.profile_pic}
                                        name={conv?.userDetails?.name}
                                        width={40}
                                        height={40}
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-white truncate">
                                            {conv?.userDetails?.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                                            {conv?.lastMsg?.imageUrl && (
                                                <div className="flex items-center gap-1">
                                                    <FaImage size={14} />
                                                    {!conv?.lastMsg?.text && <span>Image</span>}
                                                </div>
                                            )}
                                            {conv?.lastMsg?.videoUrl && (
                                                <div className="flex items-center gap-1">
                                                    <FaVideo size={14} />
                                                    {!conv?.lastMsg?.text && <span>Video</span>}
                                                </div>
                                            )}
                                            <p className="truncate">{conv?.lastMsg?.text}</p>
                                        </div>
                                    </div>
                                    {Boolean(conv?.unseenMsg) && (
                                        <span className="ml-auto w-6 h-6 flex justify-center items-center bg-blue-500 text-white text-xs font-semibold rounded-full">
                                            {conv?.unseenMsg}
                                        </span>
                                    )}
                                </NavLink>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>

            {/* Render SearchUser Modal */}
            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}

            {/* Render EditUserDetails Modal */}
            {editUserOpen && (
                <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
            )}

            {/* Render Notes Modal */}
            {isNotesOpen && <NotesModal onClose={() => setIsNotesOpen(false)} />}
        </motion.div>
    );
};

export default Sidebar;
