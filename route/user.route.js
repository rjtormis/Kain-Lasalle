import { Router } from "express";
import { app } from "../server";

const userRouter = Router();

// Create user
userRouter.route("/register").post();
