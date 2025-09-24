import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

export default function AddAdminModal({ onClose, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-center text-[#006644]">
          ➕ Add New Admin
        </h2>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none 
                       focus:ring-2 focus:ring-[#006644]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none 
                       focus:ring-2 focus:ring-[#006644]"
          />
          <input
            type="text"
            name="role"
            placeholder="Role (e.g., Admin)"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none 
                       focus:ring-2 focus:ring-[#006644]"
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none 
                         focus:ring-2 focus:ring-[#006644]"
            />
            <button
              type="button"
              className="absolute right-3 top-2 text-[#006644]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#006644] text-white py-2 rounded-md 
                       hover:bg-green-100 hover:text-[#006644] 
                       transition duration-200"
          >
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
}
