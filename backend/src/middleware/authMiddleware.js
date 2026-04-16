import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // DEBUG: Yahan check karein decoded object mein kya aa raha hai
      // console.log("Decoded Token:", decoded);

      // Agar token sign karte waqt { id: user._id } tha toh theek hai,
      // warna decoded._id use karein
      req.user = await User.findById(decoded.id || decoded._id).select(
        "-password",
      );

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Verify Error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};
