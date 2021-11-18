import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: './config.env' });

const dbConnectionString = process.env.ATLAS_DB_CONNECTION_STRING.replace(
    '<password>', process.env.ATLAS_DB_PASSWORD
);

mongoose
    .connect(dbConnectionString)
    .then(() => {
        console.log('database connected...');
    });