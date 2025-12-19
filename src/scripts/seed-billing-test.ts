import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../infrastructure/db";
import { SolarUnit } from "../infrastructure/entities/SolarUnit";
import { User } from "../infrastructure/entities/User";
import { EnergyGenerationRecord } from "../infrastructure/entities/EnergyGenerationRecord";
import { subMonths, subDays } from "date-fns";

dotenv.config();

/**
 * SEED SCRIPT FOR BILLING TEST
 * 
 * 1. Finds the first user in the DB (or creates a placeholder).
 * 2. Creates a Solar Unit installed on the *current day* of the *previous month*.
 *    - This ensures `generateInvoices` will pick it up today.
 * 3. Seeds 30 days of Energy Generation Records for that unit.
 * 4. This enables you to run `trigger-invoices.ts` immediately after and get a real invoice.
 */
async function seedBillingData() {
    try {
        console.log("Connecting...");
        await connectDB();

        // 1. Get User
        const targetClerkId = "user_36wJfm6mv2WH6ga8OPKSr6fS4CD"; // User provided ID
        let user = await User.findOne({ clerkUserId: targetClerkId });

        if (!user) {
            console.log(`User with Clerk ID ${targetClerkId} not found.`);
            // Fallback: try to find ANY user to prevent crash, but warn
            user = await User.findOne({});
            if (user) console.log(`Falling back to first available user: ${user.email}`);
        } else {
            console.log(`Found target user: ${user.email} (${user._id})`);
        }

        if (!user) {
            console.error("No users found in DB. Please sign up via frontend first.");
            process.exit(1);
        }
        console.log(`Linking data to user: ${user.email} (${user._id})`);

        // 2. Create Solar Unit (Installed 1 month ago on THIS day of month)
        const today = new Date();
        // We want the installation date day to match today's day
        const installationDate = subMonths(today, 1);

        // Check if unit exists
        const serial = "BILLING-TEST-UNIT-01";
        await SolarUnit.deleteOne({ serialNumber: serial });

        const unit = await SolarUnit.create({
            userId: user._id,
            serialNumber: serial,
            installationDate: installationDate,
            capacity: 5000,
            status: "ACTIVE",
        });
        console.log(`Created Solar Unit: ${unit.serialNumber}, Installed: ${unit.installationDate.toISOString()}`);

        // 3. Generate Energy Records for the last 30 days
        console.log("Seeding energy records...");
        await EnergyGenerationRecord.deleteMany({ solarUnitId: unit._id });

        const records = [];
        for (let i = 0; i < 30; i++) {
            const date = subDays(today, i);
            // Create 1 record per day for simplicity, or we could do hourly. 
            // Let's do 1 big chunk per day to ensure we have volume.
            records.push({
                solarUnitId: unit._id,
                energyGenerated: Math.floor(Math.random() * 20) + 10, // 10-30 kWh
                timestamp: date,
                intervalHours: 24
            });
        }

        await EnergyGenerationRecord.insertMany(records);
        console.log(`Seeded ${records.length} energy records.`);

        console.log("\n✅ SETUP COMPLETE");
        console.log("You can now run: npx ts-node src/scripts/trigger-invoices.ts");

    } catch (error) {
        console.error("Error seeding billing data:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedBillingData();
