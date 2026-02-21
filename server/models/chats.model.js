import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    messages: [
      {
        from: {
          type: String,
          required: true,
          enum: ["user", "system"],
        },
        message: {
          type: String,
          required: true,
        },
        videoUrl: {
          type: String,
          default: null,
        },
        code: {
          type: String,
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
