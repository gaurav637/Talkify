import axios from 'axios';

const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default uploadFile;