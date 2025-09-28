import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addData, getDataById, updateData } from "../Helper/FirebaseHelperpg";
import { IoClose } from "react-icons/io5";

export default function AddUser({ isOpen, onClose, userData, onUpdate }) {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    role: "farmer",
    phoneNumber: "",
    location: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // store validation errors

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    } else if (userId) {
      getDataById("users", userId).then((user) => {
        if (user) setFormData(user);
      });
    }
  }, [userData, userId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
  // Updated validation for phone number
if (!formData.phoneNumber.trim()) {
  newErrors.phoneNumber = "Phone number is required.";
} else if (!/^\+?\d{10,15}$/.test(formData.phoneNumber)) {
  newErrors.phoneNumber = "Phone number must be 10-15 digits, optional '+' at start.";
}

    if (!formData.location.trim()) newErrors.location = "Location is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // valid if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return; // stop if validation fails

    setLoading(true);
    try {
      if (userData?.id || userId) {
        await updateData("users", userData?.id || userId, formData);
      } else {
        await addData("users", { ...formData, createdAt: new Date().toISOString() });
      }
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white p-6 rounded-lg shadow max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">{userData ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>

          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="border px-3 py-2 rounded-md w-full"
          >
            <option value="farmer">Farmer</option>
            <option value="expert">Expert</option>
          </select>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm mt-1">{errors.phoneNumber}</span>
            )}
          </div>

          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`border px-3 py-2 rounded-md w-full ${
                errors.location ? "border-red-500" : ""
              }`}
            />
            {errors.location && (
              <span className="text-red-500 text-sm mt-1">{errors.location}</span>
            )}
          </div>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="border px-3 py-2 rounded-md w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-4 py-2 bg-[#006644] text-white rounded-md hover:bg-green-100 hover:text-[#006644] transition-all col-span-full"
          >
            {loading ? "Saving..." : userData ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}
