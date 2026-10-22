import bookingsDao from "../dao/bookings.dao.js";

export default {
  getById: (id) => bookingsDao.getById(id),
  create: (bookingData) => bookingsDao.create(bookingData),
  update: (id, changes) => bookingsDao.update(id, changes),
};
