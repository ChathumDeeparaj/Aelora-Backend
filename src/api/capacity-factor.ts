import express from "express";
import { getCapacityFactor } from "../application/capacity-factor";
import { authenticationMiddleware } from "./middlewares/authentication-middleware";

const capacityFactorRouter = express.Router();

capacityFactorRouter
  .route("/solar-unit/:id")
  .get(authenticationMiddleware, getCapacityFactor);

export default capacityFactorRouter;
