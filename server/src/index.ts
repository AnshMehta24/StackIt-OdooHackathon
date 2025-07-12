import express from "express";
import cookieParser from "cookie-parser";
import Routes from "./routes/v1.base";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { Server } from "socket.io";
import http from "http";

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

const server = http.createServer(app);

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // or specify your frontend origin
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "../public/images")));

app.use("/api/v1", Routes);

io.on("connection", (socket) => {
  console.log("⚡ New client connected");

  socket.on("join", (userId) => {
    console.log(`User joined room: ${userId}`);
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("🔥 Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
