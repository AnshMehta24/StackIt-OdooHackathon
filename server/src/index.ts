import express from "express";
import cookieParser from "cookie-parser";
import Routes from "./routes/v1.base";
import cors from "cors";
import bodyParser from "body-parser";

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

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/v1", Routes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
