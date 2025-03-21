import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import {
    PhotoIcon,
    PlusCircleIcon,
    XMarkIcon,
    BookOpenIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable glowing button with calm green gradient
const GlowingButton = ({
    children,
    onClick,
    className = "",
    type = "button"
}) => (
    <motion.button
        type={type}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
    >
        <span className="relative z-10">{children}</span>
        {/* Soft glow layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#355e3b] to-[#3A5F0B] opacity-20 blur-md" />
    </motion.button>
);

// A floating card with a subtle greenish-beige gradient
const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-gradient-to-br from-[#E2F2E6] to-[#F0EAD6] backdrop-blur-xl rounded-xl p-6 border border-[#355e3b]/10 shadow-lg"
    >
        {children}
    </motion.div>
);

const GalleryManagement = () => {
    const [formData, setFormData] = useState({
        dishId: "",
        name: "",
        price: "",
        expiryDate: "",
        listingImage: null,
        tags: [],
        ingredients: ""
    });
    const [dishes, setDishes] = useState([]);
    const [mealKits, setMealKits] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editMealKitId, setEditMealKitId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dishFormOpen, setDishFormOpen] = useState(false);
    const [newDish, setNewDish] = useState({ name: "", instructions: "" });

    const dietaryOptions = [
        "Vegan",
        "Vegetarian",
        "Pescatarian",
        "Dairy-Free",
        "Gluten-Free",
        "Halal"
    ];

    const showNotification = (message, type) => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    const handleDelete = async (mealKitId) => {
        if (!window.confirm("Are you sure you want to delete this meal kit?")) {
            return;
        }
        try {
            await api.delete(`/api/MealKit/${mealKitId}`);
            setMealKits((prevMealKits) =>
                prevMealKits.filter((kit) => kit.mealKitId !== mealKitId)
            );
            showNotification("Meal kit deleted successfully!", "success");
        } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            showNotification("Failed to delete meal kit", "error");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mealResponse, dishResponse] = await Promise.all([
                    api.get("/api/MealKit"),
                    api.get("/api/Dish")
                ]);
                setMealKits(mealResponse.data);
                setDishes(dishResponse.data);
            } catch (error) {
                console.error("Fetch error:", error.response?.data || error.message);
                showNotification("Error fetching data", "error");
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDishChange = (e) => {
        setFormData((prev) => ({ ...prev, dishId: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, listingImage: file }));
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
        setFormData((prev) => ({
            ...prev,
            tags: checked
                ? [...prev.tags, value]
                : prev.tags.filter((tag) => tag !== value)
        }));
    };

    const openForm = (mealKit = null) => {
        setIsFormOpen(true);
        setEditMode(!!mealKit);
        setEditMealKitId(mealKit?.mealKitId || null);

        if (mealKit) {
            setFormData({
                dishId: mealKit.dishIds?.[0] || "",
                name: mealKit.name || "",
                price: mealKit.price || "",
                expiryDate: mealKit.expiryDate ? mealKit.expiryDate.split("T")[0] : "",
                listingImage: null,
                tags: mealKit.tags || [],
                ingredients: mealKit.ingredients || ""
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
                ingredients: ""
            });
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dishIds = formData.dishId ? [formData.dishId] : [];
            const priceValue = parseInt(formData.price, 10);

            const errors = {};
            if (!formData.name) errors.name = ["Name is required"];
            if (!formData.price || isNaN(priceValue)) {
                errors.price = ["Price must be a valid number"];
            }
            if (priceValue < 1) errors.price = ["Price must be positive"];
            if (!formData.expiryDate) errors.expiryDate = ["Expiry date is required"];
            if (!formData.ingredients) errors.ingredients = ["Ingredients are required"];
            if (!formData.dishId) errors.dishIds = ["Base dish selection is required"];

            if (Object.keys(errors).length > 0) {
                throw { response: { data: { errors } } };
            }

            const formDataToSend = new FormData();
            dishIds.forEach((id) => formDataToSend.append("DishIds", id));
            formDataToSend.append("Name", formData.name);
            formDataToSend.append("Price", priceValue);
            formDataToSend.append("ExpiryDate", formData.expiryDate);
            formDataToSend.append("Ingredients", formData.ingredients);
            (formData.tags || []).forEach((tag) =>
                formDataToSend.append("Tags", tag)
            );

            if (formData.listingImage) {
                formDataToSend.append("ListingImage", formData.listingImage);
            }

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            };

            const endpoint = editMode
                ? `/api/MealKit/${editMealKitId}`
                : "/api/MealKit";

            await api[editMode ? "put" : "post"](endpoint, formDataToSend, config);

            showNotification(
                `MealKit ${editMode ? "updated" : "created"} successfully!`,
                "success"
            );

            const res = await api.get("/api/MealKit");
            setMealKits(res.data);
            setIsFormOpen(false);
        } catch (error) {
            console.error("Submission error:", error);
            if (error.response?.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, errors]) => {
                    errors.forEach((err) =>
                        toast.error(`${field}: ${err}`, { autoClose: 5000 })
                    );
                });
            } else {
                showNotification(
                    error.message || "Operation failed. Please check your inputs.",
                    "error"
                );
            }
        }
    };

    const handleDishSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/Dish", newDish);
            setDishes([...dishes, res.data]);
            showNotification("Dish added!", "success");
            setDishFormOpen(false);
            setNewDish({ name: "", instructions: "" });
        } catch (error) {
            console.error("Dish submission error:", error.response?.data || error.message);
            showNotification("Failed to add dish", "error");
        }
    };

    const filteredMealKits = mealKits.filter((kit) =>
        (kit.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
 
        < div className = "min-h-screen bg-[#F5F5DC] relative overflow-hidden p-8 text-gray-800" >
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-[#355e3b] to-[#3A5F0B] bg-clip-text text-transparent"
          >
            <BookOpenIcon className="w-12 h-12 mr-4 inline-block" />
            Culinary Kitchen
          </motion.h1>
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="text"
              placeholder="Search gastronomy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#355e3b] w-64"
            />
            <GlowingButton
              onClick={() => setDishFormOpen(true)}
              className="bg-[#355e3b] hover:bg-[#3A5F0B] text-white"
            >
              + New Dish
            </GlowingButton>
            <GlowingButton
              onClick={() => openForm()}
              className="bg-[#355e3b] hover:bg-[#3A5F0B] text-white"
            >
              + Meal Kit
            </GlowingButton>
          </div>
        </header>

        <AnimatePresence>
          {dishFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#355e3b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <FloatingCard>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#355e3b]">
                    New Culinary Creation
                  </h2>
                  <button
                    onClick={() => setDishFormOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-900" />
                  </button>
                </div>
                <form onSubmit={handleDishSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Dish Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newDish.name}
                      onChange={(e) =>
                        setNewDish({ ...newDish, name: e.target.value })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Instructions
                    </label>
                    <textarea
                      name="instructions"
                      value={newDish.instructions}
                      onChange={(e) =>
                        setNewDish({
                          ...newDish,
                          instructions: e.target.value
                        })
                      }
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none text-gray-900"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <GlowingButton
                      type="submit"
                      className="bg-[#355e3b] hover:bg-[#3A5F0B] text-white"
                    >
                      Create Dish
                    </GlowingButton>
                  </div>
                </form>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#355e3b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <FloatingCard>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#355e3b]">
                    {editMode ? "Edit Meal Kit" : "New Meal Kit"}
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6 text-gray-900" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Base Dish
                      </label>
                      <select
                        name="dishId"
                        value={formData.dishId}
                        onChange={handleDishChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                        required
                      >
                        <option value="">Select a base dish</option>
                        {dishes.map((dish) => (
                          <option key={dish.dishId} value={dish.dishId}>
                            {dish.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Ingredients
                    </label>
                    <textarea
                      name="ingredients"
                      value={formData.ingredients}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 h-32 resize-none text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Dietary Tags
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {dietaryOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={option.toLowerCase()}
                            checked={formData.tags.includes(
                              option.toLowerCase()
                            )}
                            onChange={handleCheckboxChange}
                            className="bg-white border border-gray-300 rounded"
                          />
                          <span className="text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Featured Image
                    </label>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Upload Image
                      </label>
                      <div
                        className="relative w-full h-48 border-dashed border-2 border-gray-300 flex items-center justify-center cursor-pointer rounded-xl bg-white"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-900">Click to upload</span>
                        )}
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <GlowingButton
                      type="submit"
                      className="bg-[#355e3b] hover:bg-[#3A5F0B] text-white"
                    >
                      {editMode ? "Update Creation" : "Launch Meal Kit"}
                    </GlowingButton>
                  </div>
                </form>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredMealKits.map((kit) => (
              <motion.div
                key={kit.mealKitId}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group relative"
              >
                {/* Soft highlight on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#355e3b]/20 to-[#3A5F0B]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative bg-gradient-to-br from-[#E2F2E6] to-[#F0EAD6] backdrop-blur-xl rounded-xl p-6 border-2 border-transparent hover:border-[#355e3b]/30 transition-all">
                  <div className="aspect-square mb-4 relative overflow-hidden rounded-xl">
                    <img
                      src={`data:image/jpeg;base64,${kit.listingImage}`}
                      alt={kit.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{kit.name}</h3>
                      <p className="text-lg font-bold text-white">
                        ${kit.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {kit.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium bg-white text-gray-900 rounded-full"
                      >
                        {tag.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === kit.mealKitId ? null : kit.mealKitId
                        )
                      }
                      className="text-gray-900 hover:text-[#355e3b] flex items-center"
                    >
                      {expandedId === kit.mealKitId ? "Collapse" : "Expand"}
                      <ChevronDownIcon
                        className={`w-4 h-4 ml-2 transition-transform ${
                          expandedId === kit.mealKitId ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div className="flex gap-2">
                      <GlowingButton
                        onClick={() => openForm(kit)}
                        className="bg-white text-[#355e3b] border border-[#355e3b] hover:bg-[#355e3b] hover:text-white text-sm"
                      >
                        Edit
                      </GlowingButton>
                      <GlowingButton
                        onClick={() => handleDelete(kit.mealKitId)}
                        className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white text-sm"
                      >
                        Delete
                      </GlowingButton>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === kit.mealKitId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-gray-900">
                            <strong>Ingredients:</strong> {kit.ingredients}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Expires:</strong>{" "}
                            {new Date(kit.expiryDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-900">
                            <strong>Base Dish:</strong>{" "}
                            {dishes.find((d) => d.dishId === kit.dishIds[0])
                              ?.name || "Unknown"}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <ToastContainer position="top-right" theme="light" />
    </div >
  );
};

export default GalleryManagement;
