// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};

export const isManager = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    next();  
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Manager only.",
    });
  }
};
    