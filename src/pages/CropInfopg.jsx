// src/pages/Cropinfo.jsx
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { MdEco } from "react-icons/md";
import Filterbtn from "../components/FilterBtnpg";
import CropCard from "../components/CropInfoCardpg";
import AddCropinfo from "../components/AddCropInfopg";
import { getAllData, deleteData } from "../Helper/FirebaseHelperpg";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

import a from "../assets/images/a.png";

function Cropinfo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // filters
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");


  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cropInfo"), async () => {
      try {
        const data = await getAllData("cropInfo");
        setCrops(data || []);
      } catch (error) {
        console.error("Error fetching crops:", error);
      }
    });

    return () => unsub();
  }, []);

  // Filter crops 
  const filteredCrops = crops.filter((crop) => {
    const name = crop?.name || "";
    const category = crop?.category || "";
    const season = crop?.season || "";

    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSeason =
      selectedSeason === "All" ||
      season.toLowerCase() === selectedSeason.toLowerCase();

    return matchesSearch && matchesCategory && matchesSeason;
  });

  const handleDeleteCrop = async (id) => {
    if (window.confirm("Are you sure you want to delete this crop?")) {
      await deleteData("cropInfo", id);   // remove from Firebase
      
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* Header + Search + Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-xl shadow p-4 mb-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <MdEco className="text-[#006644]" size={22} />
            Crop Information Management
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative flex items-center w-full sm:w-72">
              <CiSearch className="absolute left-3 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search Crop info..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md outline-none w-full text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Add Crop Button */}
            <button
              className="bg-[#006644] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-green-100 hover:text-[#006644]"
              onClick={() => {
                setSelectedCrop(null);
                setShowAddCrop(true);
              }}
            >
              <FaPlus size={14} />
              Add Crop Info
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-xl shadow p-4 mb-6">
          {/* Category Filter */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-600 text-sm font-medium mb-2">Category:</p>
            <div className="flex flex-wrap gap-2">
              {["All", "Cereals", "Pulses", "Oilseeds", "Vegetables", "Fruits", "Cash Crops"].map(
                (cat) => (
                  <Filterbtn
                    key={cat}
                    name={cat}
                    active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  />
                )
              )}
            </div>
          </div>

          {/* Season Filter */}
          <div className="flex-1 flex flex-col">
            <p className="text-gray-600 text-sm font-medium mb-2">Season:</p>
            <div className="flex flex-wrap gap-2">
              {["All", "Kharif", "Rabi", "Zaid", "All Year"].map((season) => (
                <Filterbtn
                  key={season}
                  name={season}
                  active={selectedSeason === season}
                  onClick={() => setSelectedSeason(season)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6 sm:overflow-visible">
          {filteredCrops.length > 0 ? (
            filteredCrops.map((crop, index) => (
              <div key={crop.id || index} className="min-w-[280px] sm:min-w-0">
                <CropCard
                  name={crop.name || "Unknown"}
                  scientificName={crop.scientificName || "N/A"}
                  category={crop.category || "N/A"}
                  season={crop.season || "N/A"}
                  duration={crop.duration || "N/A"}
                  soilType={crop.soilType || "N/A"}
                  waterRequirement={crop.waterRequirement || "N/A"}
                  yieldAmount={crop.yield || "N/A"}
                  marketPrice={crop.marketPrice || "N/A"}
                  image={crop.image || a}
                  url={crop.url || ""}
                  onEdit={() => {
                    setSelectedCrop(crop);
                    setShowAddCrop(true);
                  }}
                  onDelete={() => handleDeleteCrop(crop.id)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No crop information found.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddCropinfo
        isOpen={showAddCrop}
        onClose={() => {
          setShowAddCrop(false);
          setSelectedCrop(null);
        }}
        cropData={selectedCrop}
      />
    </div>
  );
}

export default Cropinfo;
