import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "bookings.json");

const readAll = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
const writeAll = (bookings) =>
  fs.writeFileSync(dataPath, JSON.stringify(bookings, null, 2));

const getById = (id) => {
  const bookings = readAll();
  return bookings.find((b) => b.id === Number(id)) ?? null;
};

const create = (bookingData) => {
  const bookings = readAll();
  const newId =
    bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
  const newBooking = { id: newId, ...bookingData };
  bookings.push(newBooking);
  writeAll(bookings);
  return newBooking;
};

const update = (id, changes) => {
  const bookings = readAll();
  const index = bookings.findIndex((b) => b.id === Number(id));
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...changes };
  writeAll(bookings);
  return bookings[index];
};

export default { getById, create, update };
