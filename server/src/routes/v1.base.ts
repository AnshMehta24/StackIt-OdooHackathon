import express from "express";
import authRoutehandler from "./auth";
import questionRouteHandler from "./question";
import uploadRouteHandler from "./fileUpload";

const router = express.Router();

router.use("/auth", authRoutehandler);
router.use("/questions", questionRouteHandler);
router.use("/upload", uploadRouteHandler);

export default router;
