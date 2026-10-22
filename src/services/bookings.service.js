import bookingsRepository from "../repositories/bookings.repository.js";
import servicesService from "./services.service.js";

const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

const createBooking = (bookingData) => {
  const missing = REQUIRED_FIELDS.filter(
    (field) => bookingData[field] === undefined,
  );
  if (missing.length > 0) {
    return { error: `Faltan campos: ${missing.join(", ")}` };
  }

  const newBooking = {
    clientName: bookingData.clientName,
    clientEmail: bookingData.clientEmail,
    date: bookingData.date,
    time: bookingData.time,
    status: bookingData.status ?? "pending",
    services: [],
  };

  return bookingsRepository.create(newBooking);
};

const getBookingById = (id) => bookingsRepository.getById(id);

const addServiceToBooking = (bookingId, serviceId) => {
  const booking = bookingsRepository.getById(bookingId);
  if (!booking) return { error: "Reserva no encontrada" };

  const service = servicesService.getServiceById(serviceId);
  if (!service) return { error: "Servicio no encontrado" };

  const sid = Number(serviceId);
  const existing = booking.services.find((s) => s.service === sid);

  const updatedServices = existing
    ? booking.services.map((s) =>
        s.service === sid ? { ...s, quantity: s.quantity + 1 } : s,
      )
    : [...booking.services, { service: sid, quantity: 1 }];

  return bookingsRepository.update(bookingId, { services: updatedServices });
};

export default { createBooking, getBookingById, addServiceToBooking };
