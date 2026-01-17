
// import "dotenv/config";
// import mongoose from "mongoose";
// import { connectDB } from "./infrastructure/db";
// import { Invoice } from "./infrastructure/entities/Invoice";

// const createManualInvoice = async () => {
//     try {
//         await connectDB();
//         console.log("Connected to MongoDB.");

//         const invoiceData = {
//             _id: new mongoose.Types.ObjectId("695c277c81b246753d4414f6"), // Fixed ID from user
//             solarUnitId: new mongoose.Types.ObjectId("695c19c06d3b50230aaf5918"),
//             userId: new mongoose.Types.ObjectId("6941ac875b609808d4537021"),
//             billingPeriodStart: new Date("2025-12-05T21:05:00.988Z"),
//             billingPeriodEnd: new Date("2026-01-05T21:05:00.989Z"),
//             totalEnergyGenerated: 450,
//             paymentStatus: "PENDING",

//             // Explicitly setting timestamps to match user request if needed, 
//             // though Mongoose usually handles createdAt/updatedAt automatically.
//             // We can pass them if the schema options allow or if we use specific methods,
//             // but usually 'new Invoice()' + save() will set new timestamps unless overridden.
//             // Given the user wants a specific record history, let's try to stick to the data.
//         };

//         // Check if it already exists to avoid duplicate key error
//         const existing = await Invoice.findById(invoiceData._id);
//         if (existing) {
//             console.log("Invoice already exists. Updating/Overwriting...");
//             await Invoice.findByIdAndUpdate(invoiceData._id, invoiceData, { upsert: true });
//         } else {
//             console.log("Creating new invoice...");
//             await Invoice.create(invoiceData);
//         }

//         console.log("Invoice created/updated successfully!");
//         console.log(invoiceData);

//     } catch (error) {
//         console.error("Error creating invoice:", error);
//     } finally {
//         await mongoose.disconnect();
//         console.log("Disconnected from MongoDB.");
//         process.exit(0);
//     }
// };

// createManualInvoice();
