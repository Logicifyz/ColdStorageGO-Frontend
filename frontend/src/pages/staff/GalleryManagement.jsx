import React, { useState, useEffect } from "react";
import api from "../../api";

const GalleryManagement = () => {
    const [formData, setFormData] = useState({
        dishId: "",
        name: "",
        price: "",
        expiryDate: "",
        listingImage: null,
        tags: [],
        ingredients: "",
    });

    const [mealKits, setMealKits] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editMealKitId, setEditMealKitId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [notification, setNotification] = useState({ message: "", type: "" });

    const dietaryOptions = [
        "Vegan",
        "Vegetarian",
        "Pescatarian",
        "Dairy-Free",
        "Lactose-Intolerant",
        "Gluten-Free",
        "Halal",
    ];

    useEffect(() => {
        const fetchMealKits = async () => {
            try {
                const response = await api.get("/api/MealKit");
                setMealKits(response.data);
            } catch (error) {
                showNotification("Error fetching MealKits", "error");
            }
        };

        fetchMealKits();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            listingImage: file,
        }));

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => {
            const updatedTags = checked
                ? [...prev.tags, value]
                : prev.tags.filter((tag) => tag !== value);
            return { ...prev, tags: updatedTags };
        });
    };

    const openForm = (mealKit = null) => {
        setIsFormOpen(true);
        setEditMode(!!mealKit);
        setEditMealKitId(mealKit ? mealKit.mealKitId : null);

        if (mealKit) {
            setFormData({
                dishId: mealKit.dishId,
                name: mealKit.name,
                price: mealKit.price,
                expiryDate: mealKit.expiryDate.split("T")[0],
                listingImage: null,
                tags: mealKit.tags,
                ingredients: mealKit.ingredients || "",
            });
            setPreviewImage(`data:image/jpeg;base64,${mealKit.listingImage}`);
        } else {
            setFormData({
                dishId: "",
                name: "",
                price: "",
                expiryDate: "",
                listingImage: null,
                tags: [],
                ingredients: "",
            });
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("dishId", formData.dishId);
        data.append("name", formData.name);
        data.append("price", formData.price);
        data.append("expiryDate", formData.expiryDate);
        data.append("ingredients", formData.ingredients);
        if (formData.listingImage) {
            data.append("listingImage", formData.listingImage);
        }
        formData.tags.forEach((tag) => data.append("tags", tag));

        try {
            if (editMode) {
                await api.put(`/api/MealKit/${editMealKitId}`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                showNotification("MealKit updated successfully!", "success");
            } else {
                const response = await api.post("/api/MealKit", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                setMealKits([...mealKits, response.data]);
                showNotification("MealKit created successfully!", "success");
            }

            setIsFormOpen(false);
            setFormData({
                dishId: "",
                name: "",
                price: "",
                expiryDate: "",
                listingImage: null,
                tags: [],
            });
        } catch (error) {
            showNotification("Failed to submit MealKit", "error");
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMealKits = mealKits.filter((kit) =>
        kit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div
            className="min-h-screen px-4 py-8"
            style={{ backgroundColor: "#383838" }}
        >
            {notification.message && (
                <div
                    className={`fixed top-4 right-4 p-4 rounded shadow-md text-white z-50 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                >
                    {notification.message}
                </div>
            )}

            <header className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-white">Meal Kit Management</h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="py-2 px-4 rounded bg-[#292929] text-white border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                    />
                    <button
                        className="bg-[#292929] text-white py-2 px-4 rounded hover:bg-gray-700 focus:outline-none"
                        onClick={() => openForm()}
                    >
                        +
                    </button>
                </div>
            </header>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#292929] text-white p-8 rounded shadow-md w-3/4 max-w-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-6">
                            {editMode ? "Edit MealKit" : "Create MealKit"}
                        </h2>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                                required
                            />
                            <input
                                type="text"
                                name="dishId"
                                placeholder="Dish ID"
                                value={formData.dishId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                                required
                            />
                            <input
                                type="date"
                                name="expiryDate"
                                value={formData.expiryDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="ingredients" className="block mb-2">Ingredients:</label>
                            <textarea
                                id="ingredients"
                                name="ingredients"
                                placeholder="Enter ingredients"
                                value={formData.ingredients}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266] h-28 resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="mb-4">
                            <label>Tags:</label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {dietaryOptions.map((option) => (
                                    <label key={option} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value={option.toLowerCase()}
                                            checked={formData.tags.includes(option.toLowerCase())}
                                            onChange={handleCheckboxChange}
                                            className="mr-2"
                                        />
                                        {option.toUpperCase()}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-[#525266]"
                        />
                        {previewImage && (
                            <img src={previewImage} alt="Preview" className="mt-4 w-16 h-16" />
                        )}
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="py-2 px-4 bg-red-600 text-white rounded"
                                onClick={() => setIsFormOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 bg-blue-600 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <section className="flex flex-col gap-4 mt-8">
                {filteredMealKits.map((kit, index) => (
                    <div
                        key={kit.mealKitId}
                        className="bg-[#292929] text-white p-4 rounded shadow"
                    >
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold">{index + 1}. {kit.name}</h3>
                            <button
                                className="px-2 py-1 text-white rounded focus:outline-none focus:ring-2 focus:ring-[#525266]"
                                onClick={() => toggleExpand(kit.mealKitId)}
                            >
                                {expandedId === kit.mealKitId ? "\u25B2" : "\u25BC"}
                            </button>
                        </div>
                        {expandedId === kit.mealKitId && (
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p><strong>ID:</strong> {kit.dishId}</p>
                                    <p><strong>Price:</strong> ${kit.price}</p>
                                    <p><strong>Expiry:</strong> {new Date(kit.expiryDate).toLocaleDateString()}</p>
                                    <p><strong>Ingredients:</strong> {kit.ingredients}</p>
                                    <div className="flex gap-2 mt-4">
                                        {kit.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-[#2B2E4A] text-white rounded text-xs"
                                            >
                                                {tag.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <img
                                        src={`data:image/jpeg;base64,${kit.listingImage}`}
                                        alt={kit.name}
                                        className="w-[150px] h-[150px] object-cover mx-auto"
                                    />
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => openForm(kit)}
                                            className="bg-[#B4C14A] text-white px-4 py-2 rounded"
                                        >
                                            Edit
                                        </button>
                                        <button className="bg-[#F95D50] text-white px-4 py-2 rounded">Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default GalleryManagement;
