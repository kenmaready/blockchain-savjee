import express from 'express';
import cors from "cors";
import router from "./routes/index.js";
import "./db.js";
import BC from "./model/Blockchain.js";

BC.getBlockchain();

const app = express();
const PORT = 3001;


// test printout of entire request object as-received:
// app.use((req, res, next) => {
//     console.log("response:", res);
//     next();
// })
app.use(express.json());
app.use(cors());
app.use(router);

export default app;