import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5135", // Backend base URL
    headers: {
        "Content-Type": "application/json",
        withCredentials: true,
    },
    withCredentials: true  // ✅ Added this line to allow cookies and credentials
});

export default api;
