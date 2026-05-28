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
      `/profile/${currentUser.id}`,
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

      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">

        {/* TOP */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">

          <h1 className="text-3xl md:text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-sm mt-2 text-blue-100">
            Update your personal details
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-10">

          {/* IMAGE */}
          <div className="flex flex-col items-center">

            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt=""
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />

            <label className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl cursor-pointer transition">

              Change Photo

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
            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold transition"
              >
                {loading
                  ? "Updating..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/chat")
                }
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-4 rounded-2xl font-semibold transition"
              >
                Back To Chat
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;