import { useEffect, useState } from "react";
import { FaUser, FaExclamationCircle } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { NavLink } from "react-router-dom";
import { getAllData } from "../Helper/FirebaseHelperpg";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [farmersCount, setFarmersCount] = useState(0);
  const [expertsCount, setExpertsCount] = useState(0);
  const [schemeCount, setSchemeCount] = useState(0);
  const [cropCount, setCropCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);

  //  Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Users
        const users = await getAllData("users");
        if (users) {
          const farmers = users.filter((u) => u.role === "farmer");
          const experts = users.filter((u) => u.role === "expert");
          setFarmersCount(farmers.length);
          setExpertsCount(experts.length);
        }

        // Schemes
        const schemes = await getAllData("govtSchemes");
        if (schemes) setSchemeCount(schemes.length);

        // Crops
        const crops = await getAllData("cropInfo");
        if (crops) setCropCount(crops.length);

        //Feedbacks
        const feedbacks = await getAllData("feedbacks");
        if (feedbacks) setComplaintsCount(feedbacks.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ["Farmers", "Experts"],
    datasets: [
      {
        data: [farmersCount, expertsCount],
        backgroundColor: ["#006644", "#e0e0e0"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      {/* Page Title */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 Dashboard
      </h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {/* Farmers */}
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Farmers</h3>
            <p className="text-gray-400 text-xs mt-1">Updated Now</p>
            <p className="text-2xl font-bold mt-2">{farmersCount}</p>
          </div>
          <FaUser className="text-green-700 text-3xl" />
        </div>

        {/* Experts */}
        <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Experts</h3>
            <p className="text-gray-400 text-xs mt-1">Updated Now</p>
            <p className="text-2xl font-bold mt-2">{expertsCount}</p>
          </div>
          <FaUser className="text-blue-700 text-3xl" />
        </div>

        {/* Complaints */}
        <NavLink
          to="/feedback"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition flex justify-between items-center"
        >
          <div>
            <h3 className="text-lg font-semibold text-red-600">Complaints</h3>
            <p className="text-gray-400 text-xs mt-1">Updated Now</p>
            <p className="text-2xl font-bold mt-2">{complaintsCount}</p>
          </div>
          <FaExclamationCircle className="text-red-600 text-3xl" />
        </NavLink>
      </div>

      {/* Schemes, Crops , Chart  */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schemes ,Crops */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Schemes & Crops Info</h2>
          <div className="space-y-4">
            {/* Schemes */}
            <NavLink
              to="/govtSchemes"
              className="block w-full bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaExclamationCircle className="text-green-600 text-2xl" />
                </div>
                <div className="flex justify-between items-start w-full font-sans">
                  <div>
                    <p className="text-sm text-green-600">Total Schemes</p>
                    <p className="text-xs text-gray-400 mt-1">Updated Now</p>
                  </div>
                  <h2 className="text-2xl font-bold">{schemeCount}</h2>
                </div>
              </div>
            </NavLink>

            {/* Crops */}
            <NavLink
              to="/cropinfo"
              className="block w-full bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FaExclamationCircle className="text-yellow-600 text-2xl" />
                </div>
                <div className="flex justify-between items-start w-full font-sans">
                  <div>
                    <p className="text-sm text-yellow-600">Total Crops</p>
                    <p className="text-xs text-gray-400 mt-1">Updated Now</p>
                  </div>
                  <h2 className="text-2xl font-bold">{cropCount}</h2>
                </div>
              </div>
            </NavLink>
          </div>
        </div>

        {/* Chart Section */}
        <div className="p-6 bg-white rounded-lg shadow flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
          <div className="w-full max-w-xs">
            <Doughnut data={chartData} options={{ cutout: "70%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
