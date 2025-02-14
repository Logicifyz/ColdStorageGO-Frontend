import React, { useState } from "react";

const ImageUploader = ({ maxImages = 10, onSave, onClose }) => {
    const [selectedImages, setSelectedImages] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedImages.length + files.length > maxImages) {
            alert(`You can upload up to ${maxImages} images.`);
            return;
        }

        setSelectedImages([...selectedImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    const handleSave = () => {
        onSave(selectedImages); // Save images to parent
        onClose(); // Close uploader
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-4/5 max-w-3xl">
                <h2 className="text-xl font-bold mb-4">Upload Photos</h2>
                <div className="grid grid-cols-5 gap-4 mb-4">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index}`}
                                className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                onClick={() => handleRemoveImage(index)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                    {selectedImages.length < maxImages && (
                        <label className="w-full h-24 border-2 border-dashed flex justify-center items-center text-gray-400 cursor-pointer">
                            +
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
