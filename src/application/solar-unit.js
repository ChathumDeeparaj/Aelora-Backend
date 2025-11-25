import { solarUnits } from "../infrastructure/data.js";
import { v4 as uuidv4 } from 'uuid';
import { SolarUnit } from "../infrastructure/entities/SolarUnit.js";

export const getAllSolarUnits = async (req,res) => {
    try{
        const solarUnits = await SolarUnit.find(); //this is a promise
        res.status(200).json(solarUnits);

    }catch(error){
        res.status(500).json({message: "Internal Server Error"});

    }
};

export const createSolarUnit = async (req, res) => {
    try{
        const {serialNumber,installationDate,capacity,status } = req.body;

        const newSolarUnit = { 
             serialNumber, 
             installationDate, 
             capacity, 
             status, 
            };
        const createdSolarUnit = await SolarUnit.create(newSolarUnit);
        res.status(201).json(createdSolarUnit);

    }catch{
        res.status(500).json({message: "Internal Server Error"});
    };
   
};

export const getSolarUnitById = async (req,res) => {
    try{
        console.log(req.params);

        const { id } = req.params;
        const solarUnit = await SolarUnit.findById(id);
       
        if (!solarUnit) {
            return res.status(404).json({ message: "Solar unit not found" });
        }
        res.status(200).json(solarUnit);

    }catch(error){
        res.status(500).json({message:"Internal Server Error"});
    }

};

export const updateSolarUnit = async (req, res) => {
    const { id } = req.params;
    const { serialNumber, installationDate, capacity, status } = req.body;
    const solarUnit = await SolarUnit.findById(id);
  
    if (!solarUnit) {
      return res.status(404).json({ message: "Solar unit not found" });
    }
  
    const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(id, {
      serialNumber,
      installationDate,
      capacity,
      status,
    });
  
    res.status(200).json(updatedSolarUnit);
  };

  export const deleteSolarUnit = async (req, res) => {
    try {
      const { id } = req.params;
      const solarUnit = await SolarUnit.findById(id);
  
      if (!solarUnit) {
        return res.status(404).json({ message: "Solar unit not found" });
      }
  
      await SolarUnit.findByIdAndDelete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
};
