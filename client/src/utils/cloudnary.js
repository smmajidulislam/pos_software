export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    `${process.env.REACT_APP_API_UPLOAD_PRESET}`
  ); // ✅ Update this
  formData.append("cloud_name", `${process.env.REACT_APP_API_CLOUD_NAME}`);

  const response = await fetch(`${process.env.REACT_APP_API_CLOUDINARY_URL}`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};
