
function Filterbtn({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded text-sm font-semibold transition duration-300
        border
        ${active 
          ? "bg-[#006644] text-white border-[#006644]" 
          : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
        }
      `}
    >
      {name}
    </button>
  );
}

export default Filterbtn;
