import { useState, useEffect } from "react";
import { FaSave, FaSignOutAlt, FaTimes, FaUserPlus } from "react-icons/fa";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import imgDefault from "../assets/images/img.png";
import AddAdminModal from "../components/AddAdminpg";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDataById,
  updateData,
  uploadImageToCloudinary,
  logout,
} from "../Helper/FirebaseHelperpg";
import { handleSignUp,getAllData ,deleteData} from "../Helper/FirebaseHelperpg";
function Setting() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const navigate = useNavigate();
//add
const handleAddAdmin = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");
  const password = formData.get("password");

  try {
    //handleSignUp 
    await handleSignUp(email, password, {
      username: name,
      role,
      image: "",
    });

    alert("✅ New admin added successfully!");
    setShowAddAdminModal(false);

  } catch (error) {
    console.error("Error adding admin:", error);
    alert("❌ Failed to add admin: " + error.message);
  }
};


  // Fetch admin data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
    navigate("/login");
  };

  const [admins, setAdmins] = useState([]);

useEffect(() => {
  const fetchAdmins = async () => {
    const users = await getAllData("users");
   const onlyAdmins = users.filter(
  u => u.role?.toLowerCase().replace(/\s/g, "") === "admin"
);

    setAdmins(onlyAdmins);
  };
  fetchAdmins();
}, []);


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
  const handleRemoveAdmin = async (id) => {
  if (!window.confirm("Are you sure you want to remove this admin?")) return;

  try {
    await deleteData("users", id); // remove from Firestore
    setAdmins((prev) => prev.filter((a) => a.id !== id)); // update state instantly
    alert("✅ Admin removed successfully!");
  } catch (error) {
    console.error("Error removing admin:", error);
    alert("❌ Failed to remove admin: " + error.message);
  }
};

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

              {/* Password */}
              <div className="flex flex-col w-full">
                <span className="text-gray-500 mb-1">Password</span>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password || ""}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#006644] w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#006644] hover:text-[#004f33] cursor-pointer"
                  >
                    {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
           <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
 {formData.role?.toLowerCase().replace(/\s/g, "") === "superadmin" && (
    <button
      onClick={() => setShowAddAdminModal(true)}
      className="bg-[#006644] text-white px-5 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-green-100 hover:text-[#006644] text-sm w-full sm:w-auto"
    >
      <FaUserPlus /> Add Admin
    </button>
  )}
  <button
    onClick={() => setShowLogoutModal(true)}
    className="bg-red-600 text-white px-5 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 text-sm w-full sm:w-auto"
  >
    <FaSignOutAlt /> Logout
  </button>
</div>

          </div>

          {/* Other Admins Table */}
        {formData.role?.toLowerCase().replace(/\s/g, "") === "superadmin" && (
  <div className="bg-white rounded-xl shadow p-6 w-full">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
      Other Admins
    </h2>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-3 border">#</th>
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Email</th>
            <th className="px-4 py-3 border">Role</th>
            <th className="px-4 py-3 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin, idx) => (
              <tr key={admin.id || idx} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                <td className="px-4 py-2 border font-medium">{admin.username}</td>
                <td className="px-4 py-2 border text-gray-600">{admin.email}</td>
                <td className="px-4 py-2 border">{admin.role}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                No other admins found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}


            
         
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

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <AddAdminModal onClose={() => setShowAddAdminModal(false)} onSubmit={handleAddAdmin} />
      )}
    </div>
  );
}

export default Setting;
