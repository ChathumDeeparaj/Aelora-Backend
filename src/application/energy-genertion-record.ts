import { GetAllEnergyGenerationRecordsQueryDto } from "../domain/dtos/solar-unit";
import { ValidationError } from "../domain/errors/errors";
import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecord";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

export const getAllEnergyGenerationRecordsBySolarUnitId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const results = GetAllEnergyGenerationRecordsQueryDto.safeParse(req.query);
    if (!results.success) {
      throw new ValidationError(results.error.message);
    }

    const { groupBy, limit } = results.data;

    if (!groupBy) {
      const energyGenerationRecords = await EnergyGenerationRecord.find({
        solarUnitId: id,
      }).sort({ timestamp: -1 });
      res.status(200).json(energyGenerationRecords);
    }

    if (groupBy === "date") {
      if (!limit) {
        const energyGenerationRecords = await EnergyGenerationRecord.aggregate([
          {
            $match: { solarUnitId: new mongoose.Types.ObjectId(id) },
          },
          {
            $group: {
              _id: {
                date: {
                  $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
                },
              },
              totalEnergy: { $sum: "$energyGenerated" },
            },
          },
          {
            $sort: { "_id.date": -1 },
          },
        ]);

        res.status(200).json(energyGenerationRecords);
      }

      const energyGenerationRecords = await EnergyGenerationRecord.aggregate([
        {
          $match: { solarUnitId: new mongoose.Types.ObjectId(id) },
        },
        {
          $group: {
            _id: {
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
              },
            },
            totalEnergy: { $sum: "$energyGenerated" },
          },
        },
        {
          $sort: { "_id.date": -1 },
        },
      ]);

      res.status(200).json(energyGenerationRecords.slice(0, parseInt(limit)));
    }
  } catch (error) {
    next(error);
  }
};

export const getSolarStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // 1. Current Power (Latest record)
    const latestRecord = await EnergyGenerationRecord.findOne({
      solarUnitId: id,
    }).sort({ timestamp: -1 });

    // 2. Total Energy, Peak Power, Average Power
    const stats = await EnergyGenerationRecord.aggregate([
      { $match: { solarUnitId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalEnergy: { $sum: "$energyGenerated" },
          peakPower: { $max: "$energyGenerated" },
          avgPower: { $avg: "$energyGenerated" },
        },
      },
    ]);

    const result = {
      currentPower: latestRecord ? latestRecord.energyGenerated : 0,
      totalEnergy: stats.length > 0 ? stats[0].totalEnergy : 0,
      peakPower: stats.length > 0 ? stats[0].peakPower : 0,
      avgPower: stats.length > 0 ? Math.round(stats[0].avgPower * 10) / 10 : 0,
    };

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};