import express from "express";
import {
  createRoadmap,
  getRoadmapById,
  getRoadmaps,
} from "../controllers/roadmap.controler.js";
import { authMiddelware } from "../middelware/authMiddelware.js";

const roadMapRouter = express.Router();

roadMapRouter.post("/roadMap", authMiddelware, createRoadmap);
roadMapRouter.get("/get-all-roadmaps", authMiddelware, getRoadmaps);
roadMapRouter.get("/get-roadmap/:id", authMiddelware, getRoadmapById);

export default roadMapRouter;
