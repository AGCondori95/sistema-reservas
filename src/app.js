import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";

const app = express();

app.use(express.json()); // sin esto, req.body llega undefined en POST/PUT

app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

export default app;
