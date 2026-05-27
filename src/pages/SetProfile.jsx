const handleUpload = async () => {

  if (!image) {
    return toast.error("Please select image");
  }

  try {

    const formData = new FormData();

    formData.append("avtar", image);

    const res = await API.put(
      `/auth/profile/${user.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    toast.success("Profile updated");

    navigate("/chat");

  } catch (error) {

    toast.error(
      error.response?.data?.msg || "Upload failed"
    );

  }

};