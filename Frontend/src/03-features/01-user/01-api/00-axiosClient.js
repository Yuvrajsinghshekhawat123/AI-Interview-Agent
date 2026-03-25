import axios from "axios";
 const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/user`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // ✅ Important for cookies

})
 

export default axiosClient;

