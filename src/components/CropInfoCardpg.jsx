import { FaEdit, FaTrash } from "react-icons/fa";

function CropCard({
  name,
  scientificName,
  category,
  season,
  duration,
  soilType,
  waterRequirement,
  yieldAmount,
  marketPrice,
  image,
  url,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md border border-gray-200 relative">
      {/* Category Badge */}
      <span
        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold
        bg-yellow-100 text-yellow-700 border border-yellow-300`}
      >
        {category || "Uncategorized"}
      </span>

      {/* Image + Title */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 self-center sm:self-start">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-md border"
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words line-clamp-2">
            {name}
          </h2>
          <p className="text-sm italic text-gray-500 mt-1 line-clamp-1">
            {scientificName}
          </p>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Crop Details */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Season</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold">
            {season}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Duration</span>
          <span className="font-bold line-clamp-1">{duration}</span>
        </div>

        <div className="flex justify-between">
          <span>Soil Type</span>
          <span className="font-bold line-clamp-1">{soilType}</span>
        </div>

        <div className="flex justify-between">
          <span>Water Requirement</span>
          <span className="font-bold line-clamp-1">{waterRequirement}</span>
        </div>

        <div className="flex justify-between">
          <span>Yield</span>
          <span className="font-bold line-clamp-1">{yieldAmount}</span>
        </div>

        <div className="flex justify-between">
          <span>Market Price</span>
          <span className="text-green-700 font-bold line-clamp-1">
            {marketPrice}
          </span>
        </div>

        <div>
          <span className="block text-gray-500">URL</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-bold text-sm mt-1 break-all line-clamp-1"
          >
            {url}
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center flex-wrap gap-3">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-white border border-[#006644] text-[#006644] font-medium px-3 py-1.5 rounded hover:bg-green-50 transition text-sm"
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 bg-white border border-red-600 text-red-600 font-medium px-3 py-1.5 rounded hover:bg-red-50 transition text-sm"
        >
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  );
}

export default CropCard;
