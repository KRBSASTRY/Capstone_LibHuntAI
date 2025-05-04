const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("🔒 Authorization header missing or malformed:", authHeader);
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    console.warn("🔐 Token is invalid or empty:", token);
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Auth Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
