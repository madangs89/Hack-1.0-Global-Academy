import mongoose from "mongoose";

const roadmapNodeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    level: {
      type: Number,
      required: true,
      enum: [1, 2, 3],
    },

    dependsOn: [
      {
        type: String,
      },
    ],

    type: {
      type: String,
      required: true,
      enum: ["concept", "practice", "project"],
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    estimated_duration: {
      type: String,
      required: true,
    },

    nodes: {
      type: [roadmapNodeSchema],
      validate: {
        validator: function (nodes) {
          return nodes.length > 0;
        },
        message: "Roadmap must contain at least one node.",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
