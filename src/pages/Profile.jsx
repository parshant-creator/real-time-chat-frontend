import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Profile = () => {

  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(
    currentUser?.avtar
  );

const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  // HANDLE INPUTS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE IMAGE
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(file);

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // UPDATE PROFILE
const handleUpdate = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const data = new FormData();

    data.append(
      "username",
      formData.username
    );

    data.append(
      "email",
      formData.email
    );

    data.append(
      "phone",
      formData.phone
    );

    // PASSWORD OPTIONAL
    if (password) {

      data.append(
        "password",
        password
      );
    }

    // IMAGE OPTIONAL
    if (image) {

      data.append(
        "avtar",
        image
      );
    }

    const res = await API.put(
      `/profile/${currentUser.id || currentUser._id}`,
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    toast.success(res.data.msg);

    navigate("/chat");

  } catch (error) {

    console.log(error);

    toast.error(
      error.response?.data?.msg ||
      error.response?.data?.error ||
      "Update failed"
    );

  } finally {

    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 flex justify-center items-center p-4">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* TOP */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white text-center">
<button
                type="button"
                onClick={() =>
                  navigate("/chat")
                }
className="absolute left-4 top-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition"              >
                Back To Chat
              </button>
          <h1 className="text-3xl md:text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-sm mt-2 text-blue-100">
            Update your personal details
          </p>
        </div>

        {/* BODY */}
        <div className="p-5 md:p-6">

          {/* IMAGE */}
          <div className="flex flex-col items-center">

            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
             className="w-24 h-24 md:w-28 md:h-28"
            />

            <label className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition">

              📷 Change Profile Photo

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                hidden
              />
            </label>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleUpdate}
            className="mt-10 space-y-6"
          >

            {/* USERNAME */}
            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                Username
              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full border border-gray-300 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* PHONE */}
            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border border-gray-300 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
<div>

  <label className="block text-gray-700 font-semibold mb-2">
    New Password
  </label>

  <input
    type="password"
    value={password}
    onChange={(e) =>
      setPassword(e.target.value)
    }
    placeholder="Enter new password"
    className="w-full border border-gray-300 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>
<div>
  <label className="block text-gray-700 font-semibold mb-2">
    New Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter new password"
      className="w-full border border-gray-300 rounded-2xl px-4 py-4 pr-12"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2"
    >
      {showPassword ? "🙈" : "👁"}
    </button>
  </div>
</div>
            {/* BUTTONS */}
            <div className="flex gap-3 pt-4">

             <button
  type="submit"
  disabled={loading}
  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
>
  {loading ? "Saving..." : "Save Changes"}
</button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;