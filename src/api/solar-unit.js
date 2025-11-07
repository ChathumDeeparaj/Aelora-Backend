import express from "express";
import { 
  getAllSolarUnits, 
  createSolarUnit, 
  getSolarUnitById 
} from "../application/solar-unit.js";

const solarUnitRouter = express.Router();

solarUnitRouter.route("/").get(getAllSolarUnits).post(createSolarUnit);
solarUnitRouter.route("/:id").get(getSolarUnitById);
// solarUnitRouter.route("/:id").get().put().delete();

export default solarUnitRouter;