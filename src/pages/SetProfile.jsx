import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const SetProfile = () => {

  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleUpload = async () => {

    if (!image) {
      return toast.error(
        "Please select image"
      );
    }

    try {

      const formData = new FormData();

      formData.append("avtar", image);

      const res = await API.put(
        `/auth/profile/${user.id}`,
        formData,
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

      toast.success("Profile Updated");

      navigate("/chat");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.msg ||
          "Upload failed"
      );
    }
  };

  const handleSkip = () => {
    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-bold text-center mb-6">
          Set Profile Picture
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 rounded-xl mt-5"
        >
          Upload
        </button>

        <button
          onClick={handleSkip}
          className="w-full bg-gray-300 py-3 rounded-xl mt-3"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default SetProfile;