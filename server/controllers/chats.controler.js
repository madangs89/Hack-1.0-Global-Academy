import { uploadVideoBuffer } from "../config/cloudinary.config.js";
import { ai } from "../config/google.config.js";
import { pubClient } from "../config/redis.connect.js";
import { io } from "../index.js";
import {
  animationGeneratorSystem,
  orionVisualEngineSystem,
} from "../llm/alllSystemInstruction.js";
import Chat from "../models/chats.model.js";

import axios from "axios";
import fs from "fs";

export function extractJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No valid JSON found");
    }
    const jsonString = text.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonString);
  }
}

export const acceptChat = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("got the request");

    let { chat, chatId } = req.body;

    if (!chat || !chat.trim()) {
      return res.status(400).json({
        message: "Chat message is required",
        success: false,
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    let chatDoc;

    if (!chatId) {
      chatDoc = await Chat.create({
        userId,
        title: `Chat on ${new Date().toLocaleString()}`,
        messages: [
          {
            from: "user",
            message: chat,
          },
        ],
      });

      chatId = chatDoc._id;
    } else {
      chatDoc = await Chat.findOne({ _id: chatId, userId });

      if (!chatDoc) {
        return res.status(404).json({
          message: "Chat not found",
          success: false,
        });
      }
      chatDoc.messages.push({
        from: "user",
        message: chat,
      });

      await chatDoc.save();
    }

    const fullHistory = chatDoc.messages;

    const chatOptimizer = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: JSON.stringify({
        currentRequest: chat,
        history: fullHistory,
      }),
      config: {
        systemInstruction: orionVisualEngineSystem,
        responseMimeType: "application/json",
      },
    });

    let cleaned = chatOptimizer.candidates[0].content.parts[0].text
      .replace(/^\s*```json\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    cleaned = extractJSON(cleaned);
    console.log("cleaned optimizer response", cleaned);

    const { normalChatRes, isVideoCall, optimizedPrompt, key } = cleaned;

    const socketId = await pubClient.hget("socketIdToUserId", userId);
    console.log("Emitting to socket ID:", socketId);

    if (socketId) {
      io.to(socketId).emit("llmUpdates", {
        chatId,
        message: normalChatRes,
        isVideoCall,
        videoUrl: null,
      });
    } else {
      io.to(userId.toString()).emit("llmUpdates", {
        chatId,
        message: normalChatRes,
        isVideoCall,
        videoUrl: null,
      });
    }
    chatDoc.messages.push({
      from: "system",
      message: normalChatRes,
    });

    await chatDoc.save();
    let videoUrl = null;

    if (isVideoCall) {
      if (
        key.includes("atom") ||
        key.includes("molecule") ||
        key.includes("electron")
      ) {
        videoUrl =
          "https://player.cloudinary.com/embed/?cloud_name=dyl1hpkdx&public_id=AtomStructure_a6yzbj";
      } else if (
        key.includes("binary") ||
        key.includes("binary search") ||
        key.includes("binarysearch")
      ) {
        videoUrl =
          "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1771731046/BinarySearchVisualization_g8rpox.mp4";
      } else if (
        key.includes("bubble") ||
        key.includes("bubble sort") ||
        key.includes("bubblesort")
      ) {
        videoUrl =
          "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1771731177/BubbleSortAnimation_dq9b03.mp4";
      } else if (
        key.includes("parabola") ||
        key.includes("parabola equation") ||
        key.includes("parabola graph")
      ) {
        videoUrl =
          "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1771731434/ParabolaExplanation_ygid0l.mp4";
      } else if (
        key.includes("solar") ||
        key.includes("solar system") ||
        key.includes("solar system explanation") ||
        key.includes("solarsystem") ||
        key.includes("planets")
      ) {
        videoUrl =
          "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1771731544/SolarSystemVisualization_gy2kdm.mp4";
      } else if (
        key.includes("merge") ||
        key.includes("merge sort") ||
        key.includes("mergesort")
      ) {
        videoUrl =
          "https://res.cloudinary.com/dyl1hpkdx/video/upload/v1771731738/MergeSortVisualization_thhsei.mp4";
      } else {
        videoUrl = "";
      }

      if (videoUrl) {
        const socketId = await pubClient.hget("socketIdToUserId", userId);
        console.log("Emitting to socket ID:", socketId);

        if (socketId) {
          io.to(socketId).emit("url", {
            chatId,
            videoUrl,
          });
        } else {
          io.to(userId.toString()).emit("url", {
            chatId,
            videoUrl,
          });
        }
        chatDoc.messages[chatDoc.messages.length - 1].videoUrl = videoUrl;
        await chatDoc.save();

        return;
      }

      const isCachedDataAwailable = await pubClient.get(key);

      if (isCachedDataAwailable) {
        console.log("Cache hit for key:", key);
        videoUrl = await pubClient.hget("videoKeyToUrl", key);
        console.log("Video URL from cache:", videoUrl);
        const socketId = await pubClient.hget("socketIdToUserId", userId);
        console.log("Emitting to socket ID:", socketId);

        if (socketId) {
          io.to(socketId).emit("url", {
            chatId,
            videoUrl,
          });
        } else {
          io.to(userId.toString()).emit("url", {
            chatId,
            videoUrl,
          });
        }
        chatDoc.messages[chatDoc.messages.length - 1].videoUrl = videoUrl;
        await chatDoc.save();
      } else {
        const vedioRes = await axios.get(
          `http://172.16.14.149:8000/generate-video`,
          {
            params: {
              query: optimizedPrompt,
              history: JSON.stringify(chatDoc.messages),
            },
            responseType: "arraybuffer", // 🔥 VERY IMPORTANT
          },
        );
        console.log(vedioRes.headers["X-Narration"]);

        console.log(vedioRes);
        const uploadRes = await uploadVideoBuffer(vedioRes.data);
        videoUrl = uploadRes.secure_url;
        io.to(userId.toString());

        const socketId = await pubClient.hget("socketIdToUserId", userId);
        console.log("Emitting to socket ID:", socketId);

        if (socketId) {
          io.to(socketId).emit("url", {
            chatId,
            videoUrl,
          });
        } else {
          io.to(userId.toString()).emit("url", {
            chatId,
            videoUrl,
          });
        }

        console.log("Video uploaded to Cloudinary:", videoUrl);
        await pubClient.hset("videoKeyToUrl", key, videoUrl);
        chatDoc.messages[chatDoc.messages.length - 1].videoUrl = videoUrl;
        await chatDoc.save();
      }
    }

    return res.status(200).json({
      message: "Chat processed successfully",
      success: true,
      normalChatRes,
      optimizedPrompt,
      key,
      chatId,
      videoUrl,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getFullChatById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { chatId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    if (!chatId) {
      return res
        .status(400)
        .json({ message: "Chat ID is required", success: false });
    }

    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });
    }

    return res.status(200).json({
      message: "Chat retrieved successfully",
      success: true,
      data: chat,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const getAllChatsHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Chats retrieved successfully",
      success: true,
      history: chats,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
