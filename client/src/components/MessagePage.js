import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '/Users/sudhanshubhardwaj/Desktop/chatApp/client/src/assets /wallpaper.jpg';
import { IoMdSend } from "react-icons/io";
import moment from 'moment';

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.socketConnection);
  console.log("socketConnection 17",socketConnection);
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => ({
      ...prev,
      imageUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({
      ...prev,
      imageUrl: ""
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);
    setMessage((prev) => ({
      ...prev,
      videoUrl: uploadPhoto.url
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({
      ...prev,
      videoUrl: ""
    }));
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params.userId);
      socketConnection.emit('seen', params.userId);
      socketConnection.on('message-user', (data) => setDataUser(data));
      socketConnection.on('message', (data) => setAllMessage(data));
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { value } = e.target;
    setMessage((prev) => ({
      ...prev,
      text: value
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      console.log("inside 104 ");
      console.log("socketConnection -> ",socketConnection);
      if (socketConnection) {
        console.log("heloo 104 inside of scoketConnection");
        const msg = socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        });
       console.log("message 113 -> ",msg);
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        });
      }
    }
  };

  return (
    <div style={{ backgroundImage: `url(${backgroundImage})` }} className='bg-no-repeat bg-cover h-screen'>
      {/* Header */}
      <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4 shadow-md'>
        <div className='flex items-center gap-4'>
          <Link to="/" className='lg:hidden'>
            <FaAngleLeft size={25} className='text-gray-600' />
          </Link>
          <Avatar width={50} height={50} imageUrl={dataUser?.profile_pic} name={dataUser?.name} userId={dataUser?._id} />
          <div>
            <h3 className='font-semibold text-lg text-gray-800 truncate'>{dataUser?.name}</h3>
            <p className='text-sm text-slate-500'>
              {dataUser.online ? <span className='text-green-500'>Online</span> : <span>Offline</span>}
            </p>
          </div>
        </div>
        <button className='cursor-pointer hover:text-primary'>
          <HiDotsVertical size={20} />
        </button>
      </header>

      {/* Messages Section */}
      <section className='h-[calc(100vh-128px)] overflow-y-scroll scrollbar relative p-4 bg-opacity-50'>
        <div className='flex flex-col gap-3' ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div key={index} className={`p-3 rounded-lg max-w-lg ${user._id === msg?.msgByUserId ? 'bg-teal-100 self-end' : 'bg-white'}`}>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt='Sent' className='w-full rounded-lg mb-2' />
              )}
              {msg.videoUrl && (
                <video src={msg.videoUrl} className='w-full rounded-lg mb-2' controls />
              )}
              <p className='text-gray-800'>{msg.text}</p>
              <p className='text-xs text-gray-500 mt-1 text-right'>{moment(msg.createdAt).format('hh:mm A')}</p>
            </div>
          ))}
        </div>

        {/* Uploaded Image Preview */}
        {message.imageUrl && (
          <div className='fixed bottom-20 left-0 w-full flex justify-center items-center bg-opacity-80 p-2'>
            <div className='relative'>
              <IoClose size={30} className='absolute top-2 right-2 cursor-pointer text-red-600' onClick={handleClearUploadImage} />
              <img src={message.imageUrl} alt='Preview' className='max-w-xs rounded-lg shadow-lg' />
            </div>
          </div>
        )}

        {/* Uploaded Video Preview */}
        {message.videoUrl && (
          <div className='fixed bottom-20 left-0 w-full flex justify-center items-center bg-opacity-80 p-2'>
            <div className='relative'>
              <IoClose size={30} className='absolute top-2 right-2 cursor-pointer text-red-600' onClick={handleClearUploadVideo} />
              <video src={message.videoUrl} controls className='max-w-xs rounded-lg shadow-lg' />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='fixed bottom-20 left-0 w-full flex justify-center items-center bg-opacity-80'>
            <Loading />
          </div>
        )}
      </section>

      {/* Message Input Section */}
      <section className='sticky bottom-0 h-16 bg-white flex items-center px-4 shadow-md'>
        <div className='relative'>
          <button onClick={handleUploadImageVideoOpen} className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200'>
            <FaPlus size={20} />
          </button>
          {openImageVideoUpload && (
            <div className='absolute bottom-12 left-0 w-40 bg-white shadow-lg rounded-lg'>
              <form className='flex flex-col'>
                <label htmlFor='uploadImage' className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'>
                  <FaImage className='text-primary' size={18} />
                  <span>Image</span>
                </label>
                <input type='file' id='uploadImage' className='hidden' onChange={handleUploadImage} />
                <label htmlFor='uploadVideo' className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'>
                  <FaVideo className='text-purple-500' size={18} />
                  <span>Video</span>
                </label>
                <input type='file' id='uploadVideo' className='hidden' onChange={handleUploadVideo} />
              </form>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className='flex items-center w-full gap-2 ml-4'>
          <input
            type='text'
            placeholder='Type your message...'
            className='w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
            value={message.text}
            onChange={handleOnChange}
          />
          <button type='submit' className='text-primary'>
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
