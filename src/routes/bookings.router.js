import { Router } from "express";
import { bookingManager } from "../managers/instances.js";

const router = Router();

// POST /api/bookings
router.post("/", (req, res) => {
  const result = bookingManager.createBooking(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

// GET /api/bookings/:bid
router.get("/:bid", (req, res) => {
  const booking = bookingManager.getBookingById(req.params.bid);
  if (!booking) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }
  res.status(200).json(booking);
});

// POST /api/bookings/:bid/services/:sid
router.post("/:bid/services/:sid", (req, res) => {
  const result = bookingManager.addServiceToBooking(
    req.params.bid,
    req.params.sid,
  );
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(200).json(result);
});

export default router;
