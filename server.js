process.on('uncaughtException', (err) => {
    console.log('Uncaught exception: shutting down application.');
    console.log(err.name, err.message);
    process.exit(1);
})

import dotenv from "dotenv";
dotenv.config({ path: './config.env' });
import app from "./app.js";

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}...`);
});

// handling all unhandled rejected promises throughout application:
process.on('unhandledRejection', (err) => {
    console.log('Unhandled rejection: shutting down applications.');
    console.log(err.name, err.message);
    // shut down server before process.exit() to give it a chance
    // to shut down gracefully if possible:
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('Termination signal (SIGTERM) received. Shutting down gracefully...');
    server.close(/*() = > console.log('Process terminated.')*/);
});


