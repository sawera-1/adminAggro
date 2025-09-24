// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Topbar from "./components/Topbarpg";
import Login from "./pages/Loginpg";
import Dashboard from "./pages/Dashboardpg";
import Users from "./pages/Userpg";
import GovtScheme from "./pages/GovtSchemespg";
import Cropinfo from "./pages/CropInfopg";
import Feedback from "./pages/Feebackpg";
import Setting from "./pages/Settingpg";
import Signup from "./pages/Signuppg";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.home.user);
  return user?.uid ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />

        {/* Protected/Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <Dashboard />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <Users />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/govtSchemes"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <GovtScheme />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cropinfo"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <Cropinfo />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <Feedback />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Topbar />
              <div className="p-6 bg-gray-50 min-h-screen">
                <Setting />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all: Redirect unknown routes */}
      
       

      </Routes>
    </BrowserRouter>
  );
}
