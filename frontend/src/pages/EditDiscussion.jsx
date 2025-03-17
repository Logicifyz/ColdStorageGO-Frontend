import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageUploader from "../components/ImageUploader"; // ? Import ImageUploader

const EditDiscussion = () => {
    const { discussionId } = useParams(); // ? Extract discussionId properly
    const navigate = useNavigate();
    const [discussionForm, setDiscussionForm] = useState({
        title: "",
        content: "",
        category: "",
        visibility: "public",
    });

    const [coverImages, setCoverImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [showImageUploader, setShowImageUploader] = useState(false);
    const quillRef = useRef(null);

    useEffect(() => {
        fetchDiscussion();
    }, [discussionId]);

    // ? Fetch discussion details
    const fetchDiscussion = async () => {
        try {
            const response = await fetch(`http://localhost:5135/api/Discussions/${discussionId}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch discussion");

            const data = await response.json();
            console.log("? [DEBUG] Fetched Discussion:", data);

            setDiscussionForm({
                title: data.title || "",
                content: data.content || "",
                category: data.category || "",
                visibility: data.visibility || "public",
            });

            if (data.coverImages && data.coverImages.length > 0) {
                setExistingImages(data.coverImages);
            }

            if (quillRef.current) {
                quillRef.current.root.innerHTML = data.content || "";
            }
        } catch (error) {
            console.error("? [ERROR] Fetching discussion:", error);
        }
    };

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
        setShowImageUploader(false);
    };

    // ? Handle discussion update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", discussionForm.title);
        formData.append("content", discussionForm.content);
        formData.append("category", discussionForm.category);
        formData.append("visibility", discussionForm.visibility);

        coverImages.forEach((file) => formData.append("coverImages", file));

        try {
            const response = await fetch(`http://localhost:5135/api/Discussions/${discussionId}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                alert("Discussion updated successfully!");
                navigate(`/forum/discussion/${discussionId}`); // ? Redirect to discussion after update
            } else {
                console.error("? Failed to update discussion.");
            }
        } catch (error) {
            console.error("? [ERROR] Updating discussion:", error);
        }
    };

    return (
        <div className="p-8 bg-[#f0f0e0] min-h-screen text-[#355E3B]">
            <h1 className="text-3xl font-bold text-center mb-8">Edit Discussion</h1>
            <form onSubmit={handleUpdate} className="bg-[#e0e0d0] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">

                {/* Image Uploader */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed border-[#355E3B] text-[#355E3B] rounded-md hover:bg-[#d0d0c0]"
                    >
                        {existingImages.length > 0 ? "Edit Uploaded Images" : "Upload Cover Photo"}
                    </button>

                    {/* Display existing images */}
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {existingImages.map((image, index) => (
                            <img key={index} src={`data:image/jpeg;base64,${image}`} alt={`Cover ${index}`} className="w-full h-24 object-cover rounded-md" />
                        ))}
                    </div>

                    {/* Image Uploader Modal */}
                    {showImageUploader && (
                        <ImageUploader
                            onSave={handleSaveImages}
                            onClose={() => setShowImageUploader(false)}
                        />
                    )}
                </div>

                {/* Title */}
                <input
                    type="text"
                    value={discussionForm.title}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                    placeholder="Discussion Title"
                    className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B] w-full mb-6"
                    required
                />

                {/* Quill Editor */}
                <div id="editor" className="bg-white text-black p-3 rounded-lg shadow-md mb-6"></div>

                {/* Category */}
                <input
                    type="text"
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    placeholder="Category"
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
                <button type="submit" className="px-6 py-3 bg-[#355E3B] text-white font-bold rounded hover:bg-[#204037] w-full mt-6">
                    Update Discussion
                </button>
            </form>
        </div>
    );

};

export default EditDiscussion;
