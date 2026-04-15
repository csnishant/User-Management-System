import User from "../models/user.js";
import { generateToken } from "../utils/jwt.js";


// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Basic Validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 2. Email normalization aur checking
    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // 3. Simple Role Assignment
    // Agar frontend se role aata hai toh wo, nahi toh default 'user'
    const assignedRole =
      role && ["admin", "manager", "user"].includes(role) ? role : "user";

    // 4. Create User
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password, // Pre-save hook use karna bcrypt ke liye
      role: assignedRole,
    });

    // 5. Success Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔍 Find user
    const user = await User.findOne({ email }).select("+password");

    // ❌ Check user & password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ❌ Check inactive user
    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Contact admin.",
      });
    }

    // ✅ Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Get Current Logged-in User (Profile)
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Logout (Optional - mainly frontend handled)
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
