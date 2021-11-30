import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: './config.env' });

const dbConnectionString = process.env.ATLAS_DB_CONNECTION_STRING.replace(
    '<password>', process.env.ATLAS_DB_PASSWORD
);

const db = mongoose
    .connect(dbConnectionString)
    .then(() => console.log("db connected..."))
        .catch();
    // mongoose
    //     .connect(dbConnectionString)
    //     .then(() => {
    //         console.log("db connected...");
    //     });
