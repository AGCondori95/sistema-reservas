import servicesDao from "../dao/services.dao.js";

export default {
  getAll: () => servicesDao.getAll(),
  getById: (id) => servicesDao.getById(id),
  create: (serviceData) => servicesDao.create(serviceData),
  update: (id, changes) => servicesDao.update(id, changes),
  delete: (id) => servicesDao.delete(id),
};
