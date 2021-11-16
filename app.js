import express from 'express';
import cors from "cors";
import router from "./routes/index.js";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(PORT, () => {
    console.log("app listening on port", PORT, "...");
})

