import express from "express";
import servicesRouter from "./routes/services.router.js";

const app = express();

app.use(express.json()); // sin esto, req.body llega undefined en POST/PUT

app.use("/api/services", servicesRouter);

export default app;
