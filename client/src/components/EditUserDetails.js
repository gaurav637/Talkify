import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Divider from './Divider';
import axios from 'axios';
import toast from 'react-hot-toast';  // Corrected 'taost' to 'toast'
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/userSlice';

// Edit user details component
const EditUserDetails = ({ onClose, user }) => {
    // Get user data from Redux store
    const userFromStore = useSelector(state => state.user);
    const [data, setData] = useState({
        name: user?.name || '',  // Fallback to empty string if undefined
        address: user?.address || '',  // Fallback to empty string if undefined
        profile_pic: user?.profile_pic || ''  // Fallback to empty string if undefined
    });

    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        // Update the data state if user prop or userFromStore changes
        setData({
            name: userFromStore?.name || user?.name || '',
            address: userFromStore?.address || user?.address || '',
            profile_pic: userFromStore?.profile_pic || user?.profile_pic || ''
        });
    }, [userFromStore, user]); // Re-run when the user prop or userFromStore changes

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value  // Correctly update state with input field value
        }));
    };

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();  // Open file input when clicking "Change Photo"
    };

    const handleUploadPhoto = async (e) => {
        try {
            const file = e.target.files[0];
            const uploadPhoto = await uploadFile(file);
            setData((prev) => ({
                ...prev,
                profile_pic: uploadPhoto?.url  // Update profile picture URL after successful upload
            }));
        } catch (error) {
            console.error("File upload error: ", error);
            toast.error('Photo upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const filteredData = {
                name: data.name,
                address: data.address,
                profile_pic: data.profile_pic,
            };
    
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL, filteredData, { withCredentials: true });
    
            console.log('response', response); // Check what the response looks like
            toast.success(response?.data?.message);
    
            if (response.data.success) {
                // Dispatch updated user data to the store
                dispatch(setUser(response.data.data));  // Ensure this contains the updated address
                // Update state with the new address
                setData({
                    ...data,
                    address: response.data.data.address  // Ensure the address is updated correctly
                });
                onClose();  // Close the modal after successful update
            }
        } catch (error) {
            console.log(error);
            toast.error('Update failed, please try again');
        }
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm'>
                <h2 className='font-semibold text-black'>Profile Details:</h2>
                <p className='text-sm text-gray-600'>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name' className='text-black'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data.name}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-primary text-red-500'
                        />
                    </div>

                    {/* Address Input */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor='address' className='text-black'>Address:</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={data.address}
                            onChange={handleOnChange}
                            className='w-full py-1 px-2 focus:outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-primary'
                        />
                    </div>

                    {/* Photo Upload Section */}
                    <div>
                        <div className='text-black'>Photo:</div>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <button className='font-semibold text-primary hover:text-secondary' onClick={handleOpenUploadPhoto}>Change Photo</button>
                            <input
                                type='file'
                                id='profile_pic'
                                className='hidden'
                                onChange={handleUploadPhoto}
                                ref={uploadPhotoRef}
                            />
                        </div>
                    </div>

                    <Divider />    

                    {/* Action Buttons */}
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                        <button type='submit' className='border-primary bg-primary text-white border px-4 py-1 rounded hover:bg-secondary'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(EditUserDetails);
