import express from "express";
import {
  getAllEnergyGenerationRecordsBySolarUnitId,
  getSolarStats,
} from "../application/energy-genertion-record";
import { authenticationMiddleware } from "./middlewares/authentication-middleware";

const energyGenerationRecordRouter = express.Router();

energyGenerationRecordRouter
  .route("/solar-unit/:id")
  .get(authenticationMiddleware, getAllEnergyGenerationRecordsBySolarUnitId);

energyGenerationRecordRouter
  .route("/stats/:id")
  .get(authenticationMiddleware, getSolarStats);

export default energyGenerationRecordRouter;