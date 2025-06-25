import { Router } from "express";
import { signUp, loginUser, getVendorSummary } from "../Controllers/userController.js";
import { secureRoute } from "../Middleware/auth.js";

export const userRouter = Router();

userRouter.post("/auth/signup", signUp);
userRouter.post("/auth/login", loginUser);
userRouter.get("/vendors/:id/summary", secureRoute, getVendorSummary);



// import { Router } from "express";
// import { signUp, loginUser } from "../Controllers/userController.js";

// export const userRouter = Router();

// // Public routes
// userRouter.post("/auth/signup", signUp);
// userRouter.post("/auth/login", loginUser);