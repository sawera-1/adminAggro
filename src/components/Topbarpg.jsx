import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import imgDefault from "../assets/images/img.png";
import { auth, db } from "../../firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userImage, setUserImage] = useState(imgDefault);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserName(userData.name || "Admin");
            setUserImage(userData.image || imgDefault);
          } else {
            setUserName(user.displayName || "Admin");
            setUserImage(user.photoURL || imgDefault);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserName("Guest");
        setUserImage(imgDefault);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Custom styles for active links
  const linkClasses = ({ isActive }) =>
  isActive
    ? "text-white border-b-2 border-white pb-1"
    : "hover:text-green-300 transition-colors";


  return (
    <div className="w-full bg-[#006644] text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">AGGRO</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink to="/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
          <NavLink to="/users" className={linkClasses}>
            Users
          </NavLink>
          <NavLink to="/govtSchemes" className={linkClasses}>
            Govt Schemes
          </NavLink>
          <NavLink to="/cropinfo" className={linkClasses}>
            Crop Info
          </NavLink>
          <NavLink to="/feedback" className={linkClasses}>
            Feedback
          </NavLink>
          <NavLink to="/settings" className={linkClasses}>
            Settings
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/settings"
            className="flex items-center gap-2 ml-4 hover:opacity-80"
          >
            <img
              src={userImage}
              alt="Profile"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white"
            />
            <span className="text-sm sm:text-base font-medium">
              {userName}
            </span>
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <XMarkIcon className="h-7 w-7" />
          ) : (
            <Bars3Icon className="h-7 w-7" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <NavLink
            to="/dashboard"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/users"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Users
          </NavLink>
          <NavLink
            to="/govtSchemes"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Govt Schemes
          </NavLink>
          <NavLink
            to="/cropinfo"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Crop Info
          </NavLink>
          <NavLink
            to="/feedback"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Feedback
          </NavLink>
          <NavLink
            to="/settings"
            className={linkClasses}
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </NavLink>

          {/* Profile */}
          <NavLink
            to="/settings"
            className="flex items-center gap-2 mt-2 hover:opacity-80"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={userImage}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <span className="text-sm font-medium">{userName}</span>
          </NavLink>
        </div>
      )}
    </div>
  );
}
