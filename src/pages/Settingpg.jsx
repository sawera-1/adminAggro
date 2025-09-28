import { useState, useEffect } from "react";
import { FaSave, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import imgDefault from "../assets/images/img.png";
import { auth } from "../../firebase";
import {
  getDataById,
  updateData,
  uploadImageToCloudinary,
  logout,
} from "../Helper/FirebaseHelperpg";

function Setting() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // Fetch admin data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user?.uid) {
        try {
          const adminData = await getDataById("users", user.uid);
          setFormData(adminData || null);
        } catch (error) {
          console.error("Error fetching admin:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      let imageUrl = formData.image;
      if (selectedImage) imageUrl = await uploadImageToCloudinary(selectedImage);

      await updateData("users", formData.id, { ...formData, image: imageUrl });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
    alert("Logged out successfully!");
    setShowLogoutModal(false);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No admin data found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#f5f5f5]">
      {/* Left Panel */}
      <div className="flex flex-1 flex-col items-center p-4 sm:p-6 lg:p-8 w-full">
        <div className="flex flex-col w-full max-w-4xl gap-8">
          {/* Admin Profile Card */}
          <div className="bg-white rounded-xl shadow p-6 w-full">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Admin Profile
            </h2>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={selectedImage ? URL.createObjectURL(selectedImage) : formData.image || imgDefault}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-1 ml-2 flex-1 min-w-0">
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleChange}
                    className="text-lg sm:text-xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-[#006644] truncate w-full"
                  />
                  <p className="text-sm text-gray-500 truncate">Account Settings</p>
                </div>
              </div>

              {/* Save / Upload */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <button
                  onClick={handleSave}
                  className="bg-[#006644] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-100 hover:text-[#006644] text-sm w-full sm:w-auto"
                >
                  <FaSave /> Save
                </button>
                <label className="bg-[#006644] text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-100 hover:text-[#006644] text-sm w-full sm:w-auto cursor-pointer">
                  Choose File
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              {["username", "email", "role"].map((field) => (
                <div className="flex flex-col gap-1 w-full" key={field}>
                  <span className="text-gray-500">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006644] w-full"
                  />
                </div>
              ))}

              
            </div>

            {/* Logout Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 text-sm w-full sm:w-auto"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowLogoutModal(false)}
            >
              <FaTimes size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 text-sm flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;
