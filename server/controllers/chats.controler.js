import { ai } from "../config/google.config.js";
import {
  animationGeneratorSystem,
  orionVisualEngineSystem,
} from "../llm/alllSystemInstruction.js";
import Chat from "../models/chats.model.js";

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

    const { normalChatRes, isVideoCall, optimizedPrompt, key } = cleaned;

    chatDoc.messages.push({
      from: "system",
      message: normalChatRes,
    });

    await chatDoc.save();

    return res.status(200).json({
      message: "Chat processed successfully",
      success: true,
      normalChatRes,
      optimizedPrompt,
      key,
      chatId,
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
