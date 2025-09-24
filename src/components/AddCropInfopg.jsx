import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { addData, updateData } from "../Helper/FirebaseHelperpg";

function AddCropinfo({ isOpen, onClose, cropData = null, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    category: "",
    season: "",
    duration: "",
    soilType: "",
    waterRequirement: "",
    yieldAmount: "",
    marketPrice: "",
    url:""
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prefill form 
  useEffect(() => {
    if (cropData) {
      setFormData({
        name: cropData.name || "",
        scientificName: cropData.scientificName || "",
        category: cropData.category || "",
        season: cropData.season || "",
        duration: cropData.duration || "",
        soilType: cropData.soilType || "",
        waterRequirement: cropData.waterRequirement || "",
        yieldAmount: cropData.yieldAmount || "",
        marketPrice: cropData.marketPrice || "",
        url:cropData.url ||""
      });
    } else {
      setFormData({
        name: "",
        scientificName: "",
        category: "",
        season: "",
        duration: "",
        soilType: "",
        waterRequirement: "",
        yieldAmount: "",
        marketPrice: "",
        url:""
      });
      setImage(null);
    }
  }, [cropData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const dataToSave = { ...formData, updatedAt: new Date() };
    try {
      if (cropData?.id) {
        // Update
        await updateData("cropInfo", cropData.id, dataToSave);
        onUpdate?.({ ...dataToSave, id: cropData.id });
        alert("Crop info updated successfully!");
      } else {
        // Add new
        await addData("cropInfo", dataToSave);
        alert("Crop info added successfully!");
      }
      onClose();
    } catch (err) {
      console.error("Error saving crop info:", err);
      alert("Error saving crop info");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[95%] max-w-4xl rounded-md p-8 relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {cropData ? "Edit Crop Info" : "Add Crop Info"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side inputs */}
          <div className="space-y-4">
            {[
              { name: "name", label: "Name", placeholder: "Enter crop name" },
              { name: "scientificName", label: "Scientific Name", placeholder: "Enter scientific name" },
              { name: "category", label: "Category", placeholder: "Enter category" },
              { name: "season", label: "Season", placeholder: "Enter season" },
              { name: "duration", label: "Duration", placeholder: "Enter Duration" },
              { name: "soilType", label: "Soil Type", placeholder: "Enter Soil Type" },
              { name: "waterRequirement", label: "Water Requirement", placeholder: "Enter Water Requirement" },
              { name: "yieldAmount", label: "Yield Amount", placeholder: "Enter Yield Amount" },
              { name: "marketPrice", label: "Market Price", placeholder: "Enter Market Price" },
               { name: "url", label: "url", placeholder: "Enter url" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border rounded px-4 py-2"
                />
              </div>
            ))}
          </div>

          {/* Right side image upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#006644] rounded-lg p-4">
            <label className="block font-medium mb-2">Upload Picture</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileUpload"
              onChange={handleImageChange}
            />
            <label
              htmlFor="fileUpload"
              className="bg-[#006644] text-white px-4 py-2 rounded cursor-pointer"
            >
              Choose Image
            </label>
            <span className="text-sm text-gray-500 mt-2">
              {image ? image.name : "No image chosen"}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#006644] text-white px-6 py-2 rounded hover:bg-green-100 hover:text-[#006644]"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCropinfo;
