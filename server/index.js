import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./connectDb/connectDb.js";
import chatRouter from "./routes/chat.routes.js";
import { Server } from "socket.io";
import { createServer } from "http";

import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs-extra";
import renderRemotion from "./config/renderRemotion.js";

import { fileURLToPath } from "url";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { connectRedis, pubClient } from "./config/redis.connect.js";
import { ai } from "./config/google.config.js";
import { roadMapSystemInstruction } from "./llm/alllSystemInstruction.js";
import { extractJSON } from "./controllers/chats.controler.js";
import roadMapRouter from "./routes/roadmap.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/llm", roadMapRouter);

app.post("/render", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  const id = uuidv4();
  const tempDir = path.join(__dirname, "temp", id);
  const entryFile = path.join(tempDir, "index.jsx"); // JS ONLY
  const outputFile = path.join(tempDir, "output.mp4");

  try {
    await fs.ensureDir(tempDir);

    // Save LLM generated FULL Remotion entry file
    await fs.writeFile(entryFile, code);

    // Render video
    await renderRemotion(entryFile, outputFile);

    if (!fs.existsSync(outputFile)) {
      return res.status(500).json({ error: "Video not generated" });
    }

    res.sendFile(outputFile, async () => {
      await fs.remove(tempDir);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Rendering failed",
      details: err.message,
    });
  }
});

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.id;
  // if (userId) {
  //   console.log(userId, socket.id);

  //   pubClient.hset("socketIdToUserId", userId, socket.id);
  // }

  if (userId) {
    socket.join(userId);
    console.log("User joined room:", userId);
  }

  // socket.on("disconnect", async () => {
  //   if (userId) {
  //     await pubClient.hdel("socketIdToUserId", userId);
  //   }
  // });
});

server.listen(port, async () => {
  await connectRedis();
  await connectDb();
  console.log(`Server is running on port ${port}`);
});
