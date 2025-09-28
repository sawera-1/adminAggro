import { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { MdPersonOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { getAllData, deleteData } from "../Helper/FirebaseHelperpg";
import AddUser from "../components/AddUserpg";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllData("users");
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowAddUser(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoading(true);
        await deleteData("users", id);
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      ["farmer", "expert"].includes((user.role || "").toLowerCase()) &&
      (user.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MdPersonOutline className="text-[#006644]" size={22} />
            Farmers & Experts
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex items-center w-full sm:w-72">
              <FiSearch className="absolute left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none w-full text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Add User */}
            <button
              className="bg-[#006644] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-green-100 hover:text-[#006644]"
              onClick={() => {
                setSelectedUser(null);
                setShowAddUser(true);
              }}
            >
              <FaPlus size={14} />
              Add User
            </button>
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
                <th className="text-left p-3">Actions</th>
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
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-2 bg-white border border-[#006644] text-[#006644] font-medium px-3 py-1.5 rounded hover:bg-green-50 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="flex items-center gap-2 bg-white border border-red-600 text-red-600 font-medium px-3 py-1.5 rounded hover:bg-red-50 transition text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-gray-500">
                    No farmers or experts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / AddUser Component */}
      {showAddUser && (
        <AddUser
          isOpen={showAddUser}
          onClose={() => {
            setShowAddUser(false);
            setSelectedUser(null);
          }}
          userData={selectedUser}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}
