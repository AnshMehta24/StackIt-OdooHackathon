import express from "express";
import authRoutehandler from "./auth";

const router = express.Router();

router.use("/auth", authRoutehandler);

export default router;
