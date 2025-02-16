import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageUploader from "../components/ImageUploader"; // ? Import ImageUploader

const CreateDiscussion = () => {
    const [discussionForm, setDiscussionForm] = useState({
        title: "",
        content: "",
        category: "",
        visibility: "public",
    });

    const [coverImages, setCoverImages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [showImageUploader, setShowImageUploader] = useState(false); // ? Controls ImageUploader modal
    const quillRef = useRef(null);

    // ? Fetch the logged-in user like `CreateRecipe.jsx`
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5135/api/Auth/check-session", {
                    method: "GET",
                    credentials: "include", // ? Ensures session-based authentication
                });

                const data = await response.json();
                if (data.sessionValid) {
                    setUserId(data.userId);
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
            }
        };

        fetchUser();
    }, []);

    // ? Initialize Quill Editor
    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill("#editor", {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["blockquote", "code-block"],
                        ["link", "image"],
                        [{ align: [] }],
                        [{ color: [] }, { background: [] }],
                        ["clean"]
                    ]
                }
            });

            quillRef.current.on("text-change", () => {
                setDiscussionForm(prev => ({
                    ...prev,
                    content: quillRef.current.root.innerHTML
                }));
            });
        }
    }, []);

    // ? Handle Cover Image Selection
    const handleSaveImages = (images) => {
        setCoverImages(images);
        setShowImageUploader(false); // ? Close uploader after selecting images
    };

    // ? Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            alert("You must be logged in to create a discussion.");
            return;
        }

        const formData = new FormData();
        formData.append("title", discussionForm.title);
        formData.append("content", discussionForm.content);
        formData.append("category", discussionForm.category);
        formData.append("visibility", discussionForm.visibility);
        formData.append("userId", userId); // ? Ensure userId is included

        coverImages.forEach((file) => formData.append("coverImages", file));

        try {
            const response = await fetch("http://localhost:5135/api/Discussions", {
                method: "POST",
                credentials: "include", // ? Same as `CreateRecipe.jsx`
                body: formData,
            });

            if (response.ok) {
                alert("Discussion created successfully!");
                setDiscussionForm({ title: "", content: "", category: "", visibility: "public" });
                setCoverImages([]);
                quillRef.current.root.innerHTML = ""; // Clear editor
            } else {
                console.error("Failed to create discussion.");
            }
        } catch (error) {
            console.error("Error creating discussion:", error);
        }
    };

    return (
        <div className="p-8 bg-[#2F2F2F] min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-8">Create Discussion</h1>
            <form onSubmit={handleSubmit} className="bg-[#383838] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">

                {/* ? Image Uploader (Same as Recipe, At the Top) */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed text-gray-300 rounded-md hover:bg-[#444]"
                    >
                        {coverImages.length > 0 ? "Edit Uploaded Images" : "Upload Cover Photo"}
                    </button>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {coverImages.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Discussion Title"
                    value={discussionForm.title}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    required
                />

                {/* Quill Editor */}
                <div id="editor" className="bg-white text-black mb-6 p-3 rounded"></div>

                {/* Category */}
                <input
                    type="text"
                    placeholder="Category"
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    required
                />

                {/* Visibility */}
                <select
                    value={discussionForm.visibility}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, visibility: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    required
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends-only">Friends Only</option>
                </select>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 w-full mt-6"
                >
                    Post Discussion
                </button>
            </form>

            {/* ? Image Uploader Modal (Only Opens When Needed) */}
            {showImageUploader && (
                <ImageUploader
                    maxImages={10}
                    onSave={handleSaveImages}
                    onClose={() => setShowImageUploader(false)}
                />
            )}
        </div>
    );
};

export default CreateDiscussion;
