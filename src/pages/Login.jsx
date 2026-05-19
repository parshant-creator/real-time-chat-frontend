import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await new Promise((resolve)=>
        setTimeout(resolve, 1500)
      )
      const res = await API.post("/login", formData);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.msg);

      setTimeout(() => {
        navigate("/chat");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login Failed");
    } 
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4 py-6 sm:px-6 lg:px-8">
      {/* MAIN CARD */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
        {/* TOP */}
        <div className="flex flex-col items-center mb-8">
          {/* LOGO */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl sm:text-4xl font-bold">
              💬
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-5 text-gray-800 text-center">
            Welcome Back
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-2 text-center">
            Login to continue chatting with friends
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold transition duration-300 shadow-lg text-sm sm:text-base"
          >
          {loading ? "Loading...":"Log In"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm sm:text-base text-gray-600 mt-7">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
