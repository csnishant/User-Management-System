
// ✅ CREATE USER (Admin only)
import User from "../models/user.js";
import crypto from "crypto";

// Helper: generate password
const generatePassword = () => crypto.randomBytes(6).toString("hex");

export const createUserByAdmin = async (req, res) => {
  try {
    let { username, email, password, role, status } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        message: "Username and Email are required",
      });
    }

    email = email.toLowerCase().trim();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const generatedPassword = password || generatePassword();

    const user = await User.create({
      username,
      email,
      password: generatedPassword,
      role: role || "user",
      status: status || "active",
      createdBy: req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
      generatedPassword: password ? null : generatedPassword,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ UPDATE USER 
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = ["username", "email", "role", "status"];

    const updates = {};
    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, status } = req.query;

    const query = {};

    // ❌ exclude current logged-in user
    if (req.user?._id) {
      query._id = { $ne: req.user._id };
    }

    // Search
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};