import express from "express";
import authRoutehandler from "./auth";
import questionRouteHandler from "./question";
import userRouteHandler from "./user";
import uploadRouteHandler from "./fileUpload";
import answerRouter from "./answers";

const router = express.Router();

router.use("/auth", authRoutehandler);
router.use("/user", userRouteHandler);
router.use("/questions", questionRouteHandler);
router.use("/answers", answerRouter);
router.use("/upload", uploadRouteHandler);

export default router;
