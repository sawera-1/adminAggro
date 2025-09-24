import { FaEdit, FaTrash } from "react-icons/fa";

function Govtcard({ name, startdate, enddate, description, url, image, status, region, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md border border-gray-200 relative">
      {/* Status badge */}
      <span className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${
        status === "Active"
          ? "bg-green-100 text-green-700 border border-green-300"
          : "bg-red-100 text-red-700 border border-red-300"
      }`}>
        {status}
      </span>

      {/* Content */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 self-center sm:self-start">
          <img src={image} alt={name} className="w-20 h-20 object-cover rounded-md border" />
        </div>
        <div className="flex-1 flex items-center overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words leading-snug line-clamp-2">{name}</h2>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Details */}
      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between"><span>Start Date</span><span className="font-bold">{startdate}</span></div>
        <div className="flex justify-between"><span>End Date</span><span className="font-bold">{enddate}</span></div>
        <div><span className="block text-gray-500">Description</span><p className="font-bold text-sm mt-1 line-clamp-3">{description}</p></div>
        <div><span className="block text-gray-500">Region</span><p className="font-bold text-sm mt-1 line-clamp-3">{region}</p></div>
        <div><span className="block text-gray-500">URL</span><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-bold text-sm mt-1">{url}</a></div>
      </div>

      {/* Actions */}
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

export default Govtcard;
