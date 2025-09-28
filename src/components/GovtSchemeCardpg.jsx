import { FaEdit, FaTrash } from "react-icons/fa";

function Govtcard({ 
  name, 
  startdate, 
  enddate, 
  description, 
  url, 
  image, 
  status, 
  region, 
  onEdit, 
  onDelete 
}) {
  const statusStyles =
    status === "Active"
      ? "bg-green-100 text-green-700 border border-green-300"
      : "bg-red-100 text-red-700 border border-red-300";

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-md border border-gray-200 relative">
      
      {/*  Status Badge */}
      <span
        className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles}`}
      >
        {status}
      </span>

      {/*  Head */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 self-center sm:self-start">
          <img
            src={image}
            alt={name}
            className="w-20 h-20 object-cover rounded-md border"
          />
        </div>
        <div className="flex-1 flex items-center overflow-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-snug line-clamp-2 break-words">
            {name}
          </h2>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/*  Details Section */}
      <div className="space-y-3 text-sm text-gray-700">
        <DetailRow label="Start Date" value={startdate} />
        <DetailRow label="End Date" value={enddate} />

        <DetailBlock label="Description" value={description} />
        <DetailBlock label="Region" value={region} />

        <div>
          <span className="block text-gray-500">URL</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-bold text-sm mt-1 break-all"
          >
            {url}
          </a>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-center flex-wrap gap-3">
        <ActionButton
          onClick={onEdit}
          color="green"
          icon={<FaEdit />}
          label="Edit"
        />
        <ActionButton
          onClick={onDelete}
          color="red"
          icon={<FaTrash />}
          label="Delete"
        />
      </div>
    </div>
  );
}

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const DetailBlock = ({ label, value }) => (
  <div>
    <span className="block text-gray-500">{label}</span>
    <p className="font-bold text-sm mt-1 line-clamp-3">{value}</p>
  </div>
);

const ActionButton = ({ onClick, color, icon, label }) => {
  const colors =
    color === "green"
      ? "border-[#006644] text-[#006644] hover:bg-green-50"
      : "border-red-600 text-red-600 hover:bg-red-50";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-white border font-medium px-3 py-1.5 rounded transition text-sm ${colors}`}
    >
      {icon} {label}
    </button>
  );
};

export default Govtcard;
