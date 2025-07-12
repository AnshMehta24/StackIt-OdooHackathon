import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadRouteHandler = express.Router();

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    const dir = path.join(__dirname, "../../public/images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

uploadRouteHandler.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const publicPath = `/images/${req.file.filename}`;

  res.status(201).json({
    message: "File uploaded successfully",
    filePath: publicPath,
    fullUrl: `${req.protocol}://${req.get("host")}${publicPath}`,
  });
});

export default uploadRouteHandler;
