import React from "react";

const ForumPopup = ({ isOpen, onClose, onSubmit, fields, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-[#383838] text-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    {fields.map((field, index) => (
                        <div className="mb-4" key={index}>
                            {field.type === "textarea" ? (
                                <textarea
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full p-2 border border-gray-500 rounded bg-[#282828] text-white"
                                    rows="4"
                                ></textarea>
                            ) : (
                                <input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={field.value}
                                    onChange={field.onChange}
                                    className="w-full p-2 border border-gray-500 rounded bg-[#282828] text-white"
                                />
                            )}
                        </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForumPopup;
