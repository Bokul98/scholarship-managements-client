import axios from "axios";

const uploadImageToImgbb = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            formData
        );

        if (response.data.success) {
            return response.data.data.url;
        }
        throw new Error('Failed to upload image');
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default uploadImageToImgbb; 