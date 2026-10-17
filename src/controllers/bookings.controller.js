import { bookingManager } from "../managers/instances.js";

export const createBooking = (req, res) => {
  const result = bookingManager.createBooking(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
};

export const getBookingById = (req, res) => {
  const booking = bookingManager.getBookingById(req.params.bid);
  if (!booking) {
    return res.status(404).json({ error: "Reserva no encontrada" });
  }
  res.status(200).json(booking);
};

export const addServiceToBooking = (req, res) => {
  const result = bookingManager.addServiceToBooking(
    req.params.bid,
    req.params.sid,
  );
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(200).json(result);
};
