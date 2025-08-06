const UserProfile = require("../models/profilemodal");
// 🔹 Create or Update Profile
const upsertUserProfile = async (req, res) => {
  try {
    const {
      profileImage,
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
    } = req.body;

    let user = await UserProfile.findOne({ email });

    if (user) {
      // ✅ Update
      user.profileImage = profileImage || user.profileImage;
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone;
      user.username = username;
      user.password = password;
      await user.save();
      return res.status(200).json({ message: "Profile updated", user });
    } else {
      // ✅ Create
      const newUser = new UserProfile({
        profileImage,
        firstName,
        lastName,
        email,
        phone,
        username,
        password,
      });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "Profile created", user: newUser });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

// 🔹 Get profile by email
const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await UserProfile.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving profile", error: error.message });
  }
};

module.exports = { upsertUserProfile, getUserProfile };
