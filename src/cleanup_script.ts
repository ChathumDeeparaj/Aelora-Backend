import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EnergyGenerationRecord } from './infrastructure/entities/EnergyGenerationRecord';

dotenv.config();

const cleanupHighEnergyRecords = async () => {
    try {
        const mongoUri = process.env.MONGODB_URL;
        if (!mongoUri) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB.");

        const threshold = 10000;

        // Count records to be deleted
        const count = await EnergyGenerationRecord.countDocuments({
            energyGenerated: { $gt: threshold }
        });

        console.log(`Found ${count} records with energyGenerated > ${threshold}.`);

        if (count > 0) {
            console.log("Deleting records...");
            const result = await EnergyGenerationRecord.deleteMany({
                energyGenerated: { $gt: threshold }
            });
            console.log(`Successfully deleted ${result.deletedCount} records.`);

            // We don't need to manually reset sync state because the sync job
            // will check the last *remaining* record. 
            // If we delete the newest ones, the last remaining one will be older,
            // and the sync job will fetch everything since then from Data API.
        } else {
            console.log("No records found to delete.");
        }

    } catch (error) {
        console.error("Cleanup error:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    }
};

cleanupHighEnergyRecords();
