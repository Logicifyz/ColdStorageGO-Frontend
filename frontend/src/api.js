import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5135", // Backend base URL
    withCredentials: true, // Ensure credentials (cookies) are sent
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
