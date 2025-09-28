import { useState, useEffect, useCallback } from "react";
import { MdCampaign } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import Govtcard from "../components/GovtSchemeCardpg";
import Addscheme from "../components/AddGovtSchemeCardpg";
import govt from "../assets/images/govt.png";
import { getAllData, deleteData } from "../Helper/FirebaseHelperpg";
import { db } from "../../firebase"; 
import { collection, onSnapshot } from "firebase/firestore";

function GovtScheme() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showaddscheme, setShowaddscheme] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);

  
  const fetchSchemes = useCallback(async () => {
    try {
      const data = await getAllData("govtSchemes");
      setSchemes(data || []);
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  }, []);

  // Real-time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "govtSchemes"), async () => {
      await fetchSchemes(); 
    });

    return () => unsub(); 
  }, [fetchSchemes]);

  // Active or non-active 
  const now = new Date();
  const enrichedSchemes = schemes.map((s) => {
    const endDate = s.endDate?.toDate ? s.endDate.toDate() : new Date(s.endDate);
    return { ...s, isActive: endDate && endDate >= now };
  });

  // Search
  const filteredSchemes = enrichedSchemes.filter((scheme) =>
    (scheme.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSchemes = enrichedSchemes.length;
  const activeSchemes = enrichedSchemes.filter((s) => s.isActive).length;

  // Delete and auto-refresh 
  const handleDeleteScheme = async (id) => {
    if (window.confirm("Are you sure you want to delete this scheme?")) {
      try {
        await deleteData("govtSchemes", id);
        
      } catch (error) {
        console.error("Error deleting scheme:", error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MdCampaign className="text-[#006644]" size={22} />
            Government Schemes Management
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex items-center w-full sm:w-72">
              <FiSearch className="absolute left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search Schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none w-full text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Add Scheme */}
            <button
              className="bg-[#006644] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-green-100 hover:text-[#006644]"
              onClick={() => {
                setSelectedScheme(null);
                setShowaddscheme(true);
              }}
            >
              <FaPlus size={14} />
              Add Scheme
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-600">Total Schemes</p>
            <h2 className="text-2xl font-bold text-gray-900">{totalSchemes}</h2>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-600">Active Schemes</p>
            <h2 className="text-2xl font-bold text-green-600">{activeSchemes}</h2>
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 sm:overflow-visible">
          {filteredSchemes.length > 0 ? (
            filteredSchemes.map((scheme, index) => {
              const startDate = scheme.startDate?.toDate
                ? scheme.startDate.toDate().toDateString()
                : scheme.startDate || "N/A";
              const endDate = scheme.endDate?.toDate
                ? scheme.endDate.toDate().toDateString()
                : scheme.endDate || "N/A";

              return (
                <div key={scheme.id || index} className="min-w-[280px] sm:min-w-0">
                  <Govtcard
                    name={scheme.name || "Unnamed Scheme"}
                    startdate={startDate}
                    enddate={endDate}
                    description={scheme.description || "No description available."}
                    url={scheme.url || "#"}
                    image={scheme.image || govt}
                    status={scheme.isActive ? "Active" : "Non-Active"}
                    region={scheme.region || "Not specified"}
                    onEdit={() => {
                      setSelectedScheme(scheme);
                      setShowaddscheme(true);
                    }}
                    onDelete={() => handleDeleteScheme(scheme.id)}
                  />
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center w-full">No schemes found.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <Addscheme
        isOpen={showaddscheme}
        onClose={() => {
          setShowaddscheme(false);
          setSelectedScheme(null);
        }}
        schemeData={selectedScheme}
        onUpdate={() => {
          
        }}
      />
    </div>
  );
}

export default GovtScheme;
