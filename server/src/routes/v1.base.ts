import express from "express";
import authRoutehandler from "./auth";
import questionRouteHandler from "./question";
import uploadRouteHandler from "./fileUpload";
import answerRouter from "./answers";
import notificationRoutes from "./notification";
import voteRoutes from "./notification";

const router = express.Router();

router.use("/auth", authRoutehandler);
router.use("/questions", questionRouteHandler);
router.use("/answers", answerRouter);
router.use("/upload", uploadRouteHandler);
router.use("/notifications", notificationRoutes);
router.use("/votes", voteRoutes);

export default router;
