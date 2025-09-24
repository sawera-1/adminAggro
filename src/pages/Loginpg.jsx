import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logodark from "../assets/images/logodark.png";
import leftsideimg from "../assets/images/leftsideimg.png";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { login, forgotPassword } from "../Helper/FirebaseHelperpg";
import { setUser } from "../redux/Slices/HomeDataSlice";

function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
//login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const userData = await login(input.email, input.password);

      const user = userData.user || userData;
      dispatch(//redux
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          role: "admin",
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Forgot Password 
  const handleForgotPassword = async () => {
    if (!input.email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await forgotPassword(input.email);
      setMessage("Password reset email sent! Please check your inbox.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      {/* Left Side */}
      <div className="hidden md:flex w-full lg:w-[45%] bg-[#006644] items-center justify-center p-4">
        <img
          src={leftsideimg}
          alt="Left Side"
          className="w-full max-w-[500px] h-auto object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-md text-center">
          <img src={logodark} alt="Logo" className="w-40 h-40 mx-auto mb-2" />
          <h2 className="text-2xl md:text-[30px] font-bold text-[#333] mb-6 mt-2">
            Admin Login
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-left w-full"
          >
            {/* Email */}
            <div>
              <label className="text-sm font-extrabold text-[#333]">Email:</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={input.email}
                onChange={(e) =>
                  setInput({ ...input, email: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006644] w-full"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-extrabold text-[#333]">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  value={input.password}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006644] w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#006644] hover:text-[#004f33]"
                >
                  {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
                </button>
              </div>

              {/* Forgot Password Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#006644] mt-2"
                >
                  Forgot Password
                </button>
              </div>
            </div>

            {/* Error or Success messages */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 p-2 rounded bg-[#006644] text-white font-bold hover:bg-green-100 hover:text-[#006644] transition-all disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
