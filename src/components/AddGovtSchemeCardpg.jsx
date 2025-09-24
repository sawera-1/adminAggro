import { useState, useEffect } from "react"; 
import { FaTimes } from "react-icons/fa";
import { addData, updateData } from "../Helper/FirebaseHelperpg";

function Addscheme({ isOpen, onClose, schemeData = null, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    url: "",
    region: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update 
  useEffect(() => {
    if (schemeData) {
      setFormData({
        name: schemeData.name || "",
        description: schemeData.description || "",
        startDate: schemeData.startDate || "",
        endDate: schemeData.endDate || "",
        url: schemeData.url || "",
        region: schemeData.region || "",
      });
    } else {
      // Reset form 
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        url: "",
        region: "",
      });
      setImage(null);
    }
  }, [schemeData]);

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
      if (schemeData?.id) {
        await updateData("govtSchemes", schemeData.id, dataToSave);
        onUpdate({ ...dataToSave, id: schemeData.id });
        alert("Scheme updated successfully!");
      } else {
        await addData("govtSchemes", dataToSave);
        alert("Scheme added successfully!");
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error saving scheme");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-4xl rounded-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-xl">
          <FaTimes />
        </button>

        <h2 className="text-2xl font-semibold mb-6">
          {schemeData ? "Edit Government Scheme" : "Add Government Scheme"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium">NAME</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter scheme name"
                className="w-full border rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter scheme description"
                className="w-full border rounded px-4 py-2 h-24"
              />
            </div>

            <div>
              <label className="block font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/scheme"
                className="w-full border rounded px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium">Region / Province</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="e.g. Punjab, Sindh, Multan"
                className="w-full border rounded px-4 py-2"
              />
            </div>
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

export default Addscheme;