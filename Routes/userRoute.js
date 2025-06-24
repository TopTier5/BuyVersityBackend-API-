import { Router } from "express";
import { signUp, loginUser } from "../Controllers/userController.js";

export const userRouter = Router();

// Public routes
userRouter.post("/auth/signup", signUp);
userRouter.post("/auth/login", loginUser);