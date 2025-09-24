import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { MdPersonOutline } from "react-icons/md";
import { getAllData } from "../Helper/FirebaseHelperpg";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  // Fetch users 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllData("users");
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  //  Filter users by role 
  const filteredUsers = users.filter(
    (user) =>
      ["farmer", "expert"].includes((user.role || "").toLowerCase()) &&
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Title , Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MdPersonOutline className="text-[#006644]" />
          Farmers & Experts
        </h2>

        <div className="relative flex items-center w-full sm:w-80">
          <FiSearch className="absolute left-3 text-[#006644]" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md outline-none w-full focus:ring-2 focus:ring-[#006644]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Phone No.</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Join Date</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{`U-${index + 1}`}</td>
                  <td className="p-3 font-semibold">{user.name || "N/A"}</td>
                  <td className="p-3 capitalize">{user.role || "N/A"}</td>
                  <td className="p-3">{user.phoneNumber || "N/A"}</td>
                  <td className="p-3">{user.location || "N/A"}</td>
                  <td className="p-3">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-4 py-1 rounded-full inline-block text-sm shadow-md ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <strong>{user.status || "Inactive"}</strong>
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No farmers or experts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
