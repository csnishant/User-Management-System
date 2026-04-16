
import bcrypt from "bcryptjs";
import User from "../models/user.js";

// @desc    Get user profile
// @route   GET /api/v1/user/profile
export const getMyProfile = async (req, res) => {
  try {
    // req.user._id middleware se aata hai
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/user/profile
export const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Sirf name aur password hi update karne dena hai
      // Role update karne ki permission user ko nahi hai (Requirement 3.4)
      user.username = req.body.username || user.username;

      if (req.body.password) {
        user.password = req.body.password; // Model ka pre-save hook isse hash kar dega
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role, // Role wahi rahega, change nahi hoga
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
