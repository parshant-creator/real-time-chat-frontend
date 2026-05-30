import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const res = await API.post("/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.msg);

      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/chat");
    }
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-slate-50 overflow-hidden">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-4">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xl">💬</span>
          </div>

          <h2 className="text-2xl font-bold mt-2 text-gray-800">
            Welcome Back
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium transition"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
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
