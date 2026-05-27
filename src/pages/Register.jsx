import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
const Register = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post(
        "/register",
        formData
      );

      console.log(res.data);

      toast.success("Registration Successful");

     localStorage.setItem("token", res.data.token);

localStorage.setItem(
  "user",
  JSON.stringify(res.data.user)
);

setTimeout(() => {
  navigate("/set-profile");
}, 1000);

    } catch (error) {

      console.log(error.response?.data);

       toast.error(
  error.response?.data?.msg ||
  error.response?.data?.error ||
  error.message
);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 px-4 py-6 sm:px-6 lg:px-8">

      {/* MAIN CARD */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">

        {/* TOP */}
        <div className="flex flex-col items-center mb-8">

          {/* LOGO */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-3xl sm:text-4xl">
              🚀
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-5 text-gray-800 text-center">
            Create Account
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mt-2 text-center">
            Register to continue chatting
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* USERNAME */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Username
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Email
            </label>

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
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-3 sm:py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold transition duration-300 shadow-lg text-sm sm:text-base disabled:opacity-70"
          >
            {loading ? "Please Wait..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm sm:text-base text-gray-600 mt-7">
          Already have an account?{" "}

          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;