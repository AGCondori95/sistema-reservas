import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "bookings.json");

const REQUIRED_FIELDS = ["clientName", "clientEmail", "date", "time"];

class BookingManager {
  constructor(serviceManager) {
    this.serviceManager = serviceManager; // para validar que el service exista
    const fileContent = fs.readFileSync(dataPath, "utf8");
    this.bookings = JSON.parse(fileContent);
  }

  #save() {
    fs.writeFileSync(dataPath, JSON.stringify(this.bookings, null, 2));
  }

  getBookings() {
    return this.bookings;
  }

  getBookingById(id) {
    const booking = this.bookings.find((b) => b.id === Number(id));
    return booking ?? null;
  }

  createBooking(bookingData) {
    const missing = REQUIRED_FIELDS.filter(
      (field) => bookingData[field] === undefined,
    );
    if (missing.length > 0) {
      return { error: `Faltan campos: ${missing.join(", ")}` };
    }

    const newId =
      this.bookings.length > 0
        ? Math.max(...this.bookings.map((b) => b.id)) + 1
        : 1;

    const newBooking = {
      id: newId,
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      date: bookingData.date,
      time: bookingData.time,
      status: bookingData.status || "pending",
      services: [], // siempre arranca vacío; se llena con addServiceToBooking
    };

    this.bookings.push(newBooking);
    this.#save();
    return newBooking;
  }

  addServiceToBooking(bookingId, serviceId) {
    const booking = this.getBookingById(bookingId);
    if (!booking) return { error: "Reserva no encontrada" };

    const service = this.serviceManager.getServiceById(serviceId);
    if (!service) return { error: "Servicio no encontrado" };

    const sid = Number(serviceId);
    const existing = booking.services.find((s) => s.service === sid);

    if (existing) {
      existing.quantity += 1;
    } else {
      booking.services.push({ service: sid, quantity: 1 });
    }

    this.#save();
    return booking;
  }
}

export default BookingManager;
