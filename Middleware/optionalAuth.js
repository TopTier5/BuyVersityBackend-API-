// Middleware/optionalAuth.js
import jwt from "jsonwebtoken";
import { User } from "../Models/userModel.js";

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(); // no token, proceed anonymously
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = { id: user._id.toString(), role: user.role };
    }
  } catch (err) {
    // ignore token errors for optional auth
  }
  next();
};