import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
}

// Protect routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
    return;
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkeyforhospitalmanagement123",
    );

    // Add user to request
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "User not found with this token" });
      return;
    }

    next();
  } catch (err) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized to access this route" });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || "unknown"}' is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};
