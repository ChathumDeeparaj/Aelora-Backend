import { solarUnits } from "../infrastructure/data.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllSolarUnits = async (req,res) => {
    res.status(200).json(solarUnits);
};

export const createSolarUnit = async (req, res) => {
    const { userId,serialNumber,installationDate,capacity,status } = req.body;

    const newSolarUnit = {
         _id: uuidv4(), 
         userId, 
         serialNumber, 
         installationDate, 
         capacity, 
         status, 
        };

    solarUnits.push(newSolarUnit);
    res.status(201).json(newSolarUnit);
   
};

export const getSolarUnitById = async (req,res) => {
    console.log(req.params);
    
    const { id } = req.params;
    const solarUnit = solarUnits.find((solarUnit) => solarUnit._id === id);
   
    if (!solarUnit) {
        return res.status(404).json({ message: "Solar unit not found" });
    }
    res.status(200).json(solarUnit);
};