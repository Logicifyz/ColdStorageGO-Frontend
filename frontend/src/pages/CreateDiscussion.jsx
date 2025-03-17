import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageUploader from "../components/ImageUploader";

const CreateDiscussion = () => {
    const [discussionForm, setDiscussionForm] = useState({
        title: "",
        content: "",
        category: "",
        visibility: "public",
    });

    const [coverImages, setCoverImages] = useState([]);
    const [userId, setUserId] = useState(null);
    const [showImageUploader, setShowImageUploader] = useState(false);
    const quillRef = useRef(null);

    // Fetch the logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5135/api/Auth/check-session", {
                    method: "GET",
                    credentials: "include",
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

    // Initialize Quill Editor
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

    // Handle Cover Image Selection
    const handleSaveImages = (images) => {
        setCoverImages(images);
        setShowImageUploader(false);
    };

    // Handle form submission
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
        formData.append("userId", userId);

        coverImages.forEach((file) => formData.append("coverImages", file));

        try {
            const response = await fetch("http://localhost:5135/api/Discussions", {
                method: "POST",
                credentials: "include",
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
        <div className="p-8 bg-[#f0f0e0] min-h-screen text-[#355E3B]">
            <h1 className="text-3xl font-bold text-center mb-8">Create Discussion</h1>
            <form onSubmit={handleSubmit} className="bg-[#e0e0d0] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">

                {/* Image Uploader */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed border-[#355E3B] text-[#355E3B] rounded-md hover:bg-[#d0d0c0]"
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
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => setCoverImages(coverImages.filter((_, i) => i !== index))}
                                >
                                    X
                                </button>
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
                    className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B] w-full mb-6"
                    required
                />

                {/* Quill Editor */}
                <div className="mb-6">
                    <div id="editor" className="bg-white text-black rounded"></div>
                </div>

                {/* Category */}
                <input
                    type="text"
                    placeholder="Category"
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B] w-full mb-6"
                    required
                />

                {/* Visibility */}
                <select
                    value={discussionForm.visibility}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, visibility: e.target.value })}
                    className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B] w-full mb-6"
                    required
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-6 py-3 bg-[#355E3B] text-white font-bold rounded hover:bg-[#204037] w-full mt-6"
                >
                    Post Discussion
                </button>
            </form>

            {/* Image Uploader Modal */}
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