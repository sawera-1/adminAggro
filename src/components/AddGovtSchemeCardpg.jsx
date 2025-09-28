import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { addData, updateData } from "../Helper/FirebaseHelperpg";
import { uploadImageToCloudinary } from "../Helper/FirebaseHelperpg";

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
  const [preview, setPreview] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  
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
      setPreview(schemeData.image || null);
    } else {
      resetForm();
    }
    setErrors({});
  }, [schemeData]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      url: "",
      region: "",
    });
    setImage(null);
    setPreview(null);
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Scheme name is required.";
    if (!formData.description.trim()) newErrors.description = "Description is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (!formData.endDate) newErrors.endDate = "End date is required.";
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date.";
    }
    if (!formData.url) {
      newErrors.url = "URL is required.";
    } else {
      try {
        new URL(formData.url);
      } catch {
        newErrors.url = "Enter a valid URL.";
      }
    }
    if (!formData.region.trim()) newErrors.region = "Region/Province is required.";
    if (!image && !preview) newErrors.image = "You must upload an image.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let imageUrl = preview;

      if (image instanceof File) {
        imageUrl = await uploadImageToCloudinary(image);
      }

      const dataToSave = { ...formData, updatedAt: new Date(), image: imageUrl };

      if (schemeData?.id) {
        await updateData("govtSchemes", schemeData.id, dataToSave);
        onUpdate({ ...dataToSave, id: schemeData.id });
        alert("✅ Scheme updated successfully!");
      } else {
        await addData("govtSchemes", dataToSave);
        alert("✅ Scheme added successfully!");
      }

      onClose();
    } catch (err) {
      console.error("Error saving scheme:", err);
      alert("❌ Error saving scheme. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] max-w-4xl rounded-md p-8 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-black text-xl">
          <FaTimes />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">
          {schemeData ? "Edit Government Scheme" : "Add Government Scheme"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Form Fields */}
          <div className="space-y-4">
            {[
              { label: "Name", type: "text", name: "name", placeholder: "Enter scheme name" },
              { label: "Description", type: "textarea", name: "description", placeholder: "Enter scheme description" },
              { label: "Start Date", type: "date", name: "startDate" },
              { label: "End Date", type: "date", name: "endDate" },
              { label: "URL", type: "url", name: "url", placeholder: "https://example.com/scheme" },
              { label: "Region / Province", type: "text", name: "region", placeholder: "e.g. Punjab, Sindh, Multan" },
            ].map((field, idx) => (
              <div key={idx}>
                <label className="block font-medium">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border rounded px-4 py-2 h-24"
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    className="w-full border rounded px-4 py-2"
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
              </div>
            ))}
          </div>

          {/* Right: Image Upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#006644] rounded-lg p-4">
            <label className="block font-medium mb-2">Upload Picture</label>
            <input type="file" accept="image/*" id="fileUpload" className="hidden" onChange={handleImageChange} />
            <label
              htmlFor="fileUpload"
              className="bg-[#006644] text-white px-4 py-2 rounded cursor-pointer hover:bg-green-100 hover:text-[#006644] transition"
            >
              Choose Image
            </label>

            {/* Preview */}
            {preview ? (
              <img src={preview} alt="Preview" className="mt-4 w-40 h-40 object-cover rounded shadow" />
            ) : (
              <span className="text-sm text-gray-500 mt-2">No image chosen</span>
            )}
            {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-right mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#006644] text-white px-6 py-2 rounded hover:bg-green-100 hover:text-[#006644] transition"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Addscheme;
