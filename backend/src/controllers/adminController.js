// ✅ CREATE USER (Admin only)
import User from "../models/user.js";
import crypto from "crypto";

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
      // ⬇️ Audit: Current logged-in admin ID
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
    const currentUser = req.user; // Login user (Admin/Manager)

    // 1. Target user ko pehle fetch karein taaki uska role check ho sake
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // 2. 🔥 Manager Restriction Logic
    if (currentUser.role === "manager" && targetUser.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot update Admin details",
      });
    }

    // 3. Role-based Allowed Fields
    // Manager kisi ka 'role' change nahi kar sakta, sirf Admin kar sakta hai
    const allowedFields = ["username", "email", "status"];
    if (currentUser.role === "admin") {
      allowedFields.push("role");
    }

    const updates = {};
    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    // Audit: Add updatedBy field
    updates.updatedBy = currentUser?._id;

    // 4. Update Execution
    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("createdBy", "username email")
      .populate("updatedBy", "username email");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL USERS (With Audit Details)
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role, status } = req.query;
    const query = {};

    if (req.user?._id) {
      query._id = { $ne: req.user._id };
    }

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select("-password")
      .populate("createdBy", "username") // ⬇️ Sirf username fetch karein
      .populate("updatedBy", "username")
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

// ✅ GET SINGLE USER (With Audit Details)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("createdBy", "username email") // ⬇️ Important for Detail View
      .populate("updatedBy", "username email");

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

// DELETE USER (Same as your code)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "manager") {
      return res.status(403).json({
        success: false,
        message: "Managers cannot delete users",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
