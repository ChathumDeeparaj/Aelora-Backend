import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './infrastructure/entities/User';
import { SolarUnit } from './infrastructure/entities/SolarUnit';

dotenv.config();

const debugDb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URL;
        if (!mongoUri) {
            throw new Error("MONGODB_URL environment variable is not defined");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected.");

        console.log("\n--- USERS ---");
        const users = await User.find({});
        users.forEach(u => {
            console.log(`User: ${u.firstName} ${u.lastName}`);
            console.log(`  _id: ${u._id}`);
            console.log(`  clerkUserId: ${u.clerkUserId}`);
            console.log(`  email: ${u.email}`);
        });

        console.log("\n--- SOLAR UNITS ---");
        const units = await SolarUnit.find({});
        units.forEach(u => {
            console.log(`Unit: ${u.serialNumber}`);
            console.log(`  _id: ${u._id}`);
            console.log(`  userId: ${u.userId}`);
            console.log(`  status: ${u.status}`);
        });

    } catch (error) {
        console.error("Debug error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

debugDb();
