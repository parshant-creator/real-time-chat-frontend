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
    // <div className="h-screen flex items-center justify-center px-4 bg-slate-50 overflow-hidden">
    //   <div className="w-full max-w-xs bg-white rounded-2xl shadow-lg p-4">
        
    //     {/* Logo */}
    //     <div className="flex flex-col items-center mb-4">
    //       <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
    //         <span className="text-white text-xl">💬</span>
    //       </div>

    //       <h2 className="text-2xl font-bold mt-2 text-gray-800">
    //         Welcome Back
    //       </h2>

    //       <p className="text-sm text-gray-500 mt-1">
    //         Login to continue
    //       </p>
    //     </div>

    //     {/* Form */}
    //     <form onSubmit={handleSubmit} className="space-y-3">
          
    //       <div>
    //         <label className="text-sm font-medium text-gray-700">
    //           Email
    //         </label>

    //         <input
    //           type="email"
    //           name="email"
    //           placeholder="Enter email"
    //           value={formData.email}
    //           onChange={handleChange}
    //           required
    //           className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //       </div>

    //       <div>
    //         <label className="text-sm font-medium text-gray-700">
    //           Password
    //         </label>

    //         <input
    //           type="password"
    //           name="password"
    //           placeholder="Enter password"
    //           value={formData.password}
    //           onChange={handleChange}
    //           required
    //           className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    //         />
    //       </div>

    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium transition"
    //       >
    //         {loading ? (
    //           <div className="flex items-center justify-center gap-2">
    //             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    //             Loading...
    //           </div>
    //         ) : (
    //           "Log In"
    //         )}
    //       </button>
    //     </form>

    //     <p className="text-center text-sm text-gray-600 mt-4">
    //       Don't have an account?{" "}
    //       <Link
    //         to="/register"
    //         className="text-blue-600 font-semibold hover:underline"
    //       >
    //         Register
    //       </Link>
    //     </p>
    //   </div>
    // </div>
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-md">

            <h1 className="text-4xl font-bold text-center mb-2">
              Sign In
            </h1>

            <p className="text-center text-gray-500 mb-8">
              Welcome back
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
            </form>

            {/* Mobile Only */}
            <p className="text-center mt-6 lg:hidden">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold"
              >
                Register
              </Link>
            </p>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="hidden lg:flex relative items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=600&auto=format&fit=crop&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 text-center text-white px-10">
            <h2 className="text-4xl font-bold mb-4">
              Hello Friend!
            </h2>

            <p className="mb-8 text-lg">
              Connect and chat with your friends.
            </p>

            <Link
              to="/register"
              className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
