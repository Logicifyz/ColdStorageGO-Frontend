import { useEffect, useState, useRef } from "react";

const Chat = ({ userId, staffId, ticketId, isStaff }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    const socketRef = useRef(null);

    useEffect(() => {
        if (!staffId) return;

        // Avoid creating a new socket connection if it already exists
        if (socketRef.current) {
            console.log("Using existing WebSocket connection");
            return;
        }

        const createSocketConnection = () => {
            socketRef.current = new WebSocket(`ws://localhost:5135/chat?ticketId=${ticketId}`);

            socketRef.current.onopen = () => {
                setConnectionStatus("Connected");
                console.log("Connected to WebSocket server");

                // Request chat history
                socketRef.current.send(JSON.stringify({
                    type: "LoadChatHistory",
                    ticketId,
                }));
            };

            socketRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log("Parsed message:", data);

                    if (data.type === "history") {
                        if (Array.isArray(data.history)) {
                            console.log("Received chat history:", data.history);
                            setMessages(data.history);
                        } else {
                            console.error("Invalid history data:", data.history);
                        }
                    } else if (data.type === "ReceiveMessage") {
                        console.log("New chat message received:", data);
                        setMessages(prevMessages => [...prevMessages, data]); // Live update
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message", error);
                }
            };

            socketRef.current.onerror = (error) => {
                console.error("WebSocket error", error);
                setConnectionStatus("Error connecting");
            };

            socketRef.current.onclose = (event) => {
                console.log("WebSocket closed. Code:", event.code, "Reason:", event.reason);
                setConnectionStatus("Connection lost");
                // Reconnect logic
                if (event.code !== 1000) {
                    console.log("Attempting to reconnect...");
                    setTimeout(createSocketConnection, 3000); // Try to reconnect after 3 seconds
                }
            };
        };

        createSocketConnection();

        return () => {
            if (socketRef.current) {
                console.log("Closing WebSocket connection...");
                socketRef.current.close();
            }
        };
    }, [ticketId, staffId]);

    const sendMessage = () => {
        if (!message.trim()) return;

        console.log("WebSocket ReadyState:", socketRef.current.readyState);

        if (socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("Cannot send message. WebSocket is not open.");
            return;
        }

        const messageData = {
            type: "SendMessage",
            senderId: userId,
            message,
            isStaff,
            ticketId,
            staffId,
        };

        socketRef.current.send(JSON.stringify(messageData));
        setMessage(""); // Clear input field
    };

    return (
        <div className="flex flex-col w-full max-w-lg mx-auto border rounded-lg shadow-lg h-[80vh]">
            <div className="p-2 text-center text-sm text-gray-500">{connectionStatus}</div>

            {staffId ? (
                <>
                    <div className="flex flex-col gap-2 p-4 overflow-y-auto bg-gray-100 flex-grow">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-2 rounded-lg max-w-[80%] ${msg.isStaff ? "bg-blue-500 text-white self-start" : "bg-gray-300 text-black self-end"
                                    }`}
                            >
                                <strong>{msg.isStaff ? "Staff" : "User"}:</strong> {msg.message}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-white border-t">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type your message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Send
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center p-6 text-lg text-gray-500">
                    Waiting for ticket to be assigned to a staff member...
                </div>
            )}
        </div>
    );
};

export default Chat;
