import { SolarUnit } from "../infrastructure/entities/SolarUnit";
import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecord";
import { NotFoundError } from "../domain/errors/errors";
import { NextFunction, Request, Response } from "express";

export const getCapacityFactor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { days } = req.query;
    const numberOfDays = parseInt(days as string) || 7; // Default to 7 days

    const solarUnit = await SolarUnit.findById(id);
    if (!solarUnit) {
      throw new NotFoundError("Solar unit not found");
    }

    const capacityInKW = solarUnit.capacity;
    const theoreticalMaximumDaily = capacityInKW * 24;

    const fromDate = new Date();
    fromDate.setUTCHours(0, 0, 0, 0);
    fromDate.setDate(fromDate.getDate() - (numberOfDays - 1));

    const energyRecords = await EnergyGenerationRecord.aggregate([
      {
        $match: {
          solarUnitId: solarUnit._id,
          timestamp: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          totalEnergy: { $sum: "$energyGenerated" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dailyCapacityFactors = Array.from({ length: numberOfDays }, (_, i) => {
      const d = new Date(fromDate);
      d.setDate(d.getDate() + i);
      const dateString = d.toISOString().split("T")[0];
      const record = energyRecords.find((r) => r._id === dateString);
      const actualEnergyGenerated = record ? record.totalEnergy : 0;
      const capacityFactor = (actualEnergyGenerated / theoreticalMaximumDaily) * 100;
      return {
        date: dateString,
        capacityFactor: capacityFactor.toFixed(2),
        actualEnergyGenerated: actualEnergyGenerated.toFixed(2),
      };
    });

    res.status(200).json(dailyCapacityFactors);
  } catch (error) {
    next(error);
  }
};
