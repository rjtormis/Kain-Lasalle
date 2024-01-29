import { Router } from "express";
import { app } from "../server";
import { registerUser } from "../controller/user.controller";

const userRouter = Router();

// Create user
userRouter.route("/register").post(registerUser);
