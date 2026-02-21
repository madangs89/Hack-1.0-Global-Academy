import express from "express";
import { createRoadmap } from "../controllers/roadmap.controler.js";
import { authMiddelware } from "../middelware/authMiddelware.js";

const roadMapRouter = express.Router();

roadMapRouter.post("/roadMap", authMiddelware, createRoadmap);

export default roadMapRouter;
