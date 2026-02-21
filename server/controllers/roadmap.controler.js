import { ai } from "../config/google.config.js";
import { roadMapSystemInstruction } from "../llm/alllSystemInstruction.js";
import Roadmap from "../models/roadmap.model.js";
import { extractJSON } from "./chats.controler.js";

export const createRoadmap = async (req, res) => {
  try {
    const { topic, messages } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "No topic provided",
        success: false,
      });
    }

    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
        success: false,
      });
    }

    const aiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: JSON.stringify({
        topic,
        messages,
      }),
      config: {
        systemInstruction: roadMapSystemInstruction,
        responseMimeType: "application/json",
      },
    });

    let cleaned = aiRes.candidates[0].content.parts[0].text
      .replace(/^\s*```json\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    cleaned = extractJSON(cleaned);

    if (!cleaned) {
      return res.status(500).json({
        success: false,
        error: "Invalid AI response",
      });
    }

    let savedRoadmap = null;

    if (cleaned.mode === "roadmap" && cleaned.roadmap) {
      const { title, difficulty, estimated_duration, nodes } = cleaned.roadmap;

      if (!nodes || nodes.length === 0) {
        return res.status(500).json({
          success: false,
          error: "Roadmap has no nodes",
        });
      }

      await Roadmap.updateMany(
        { userId, topic, isActive: true },
        { isActive: false },
      );

      savedRoadmap = await Roadmap.create({
        userId,
        topic,
        title,
        difficulty,
        estimated_duration,
        nodes,
      });
    }

    return res.status(200).json({
      success: true,
      mode: cleaned.mode,
      normalText: cleaned.normalText || null,
      roadmap: cleaned.roadmap || null,
      roadmapId: savedRoadmap?._id || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate roadmap",
    });
  }
};
