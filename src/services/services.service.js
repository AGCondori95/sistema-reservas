import servicesRepository from "../repositories/services.repository.js";

const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

const getServices = (filters = {}) => {
  let services = servicesRepository.getAll();
  const { category, available } = filters;

  if (category) {
    const normalized = category.normalize("NFC").toLowerCase();
    services = services.filter(
      (s) => s.category.normalize("NFC").toLowerCase() === normalized,
    );
  }
  if (available !== undefined) {
    const isAvailable = available === "true";
    services = services.filter((s) => s.available === isAvailable);
  }

  return services;
};

const getServiceById = (id) => servicesRepository.getById(id);

const createService = (serviceData) => {
  const missing = REQUIRED_FIELDS.filter(
    (field) => serviceData[field] === undefined,
  );
  if (missing.length > 0) {
    return { error: `Faltan campos: ${missing.join(", ")}` };
  }

  const cleanData = Object.fromEntries(
    REQUIRED_FIELDS.map((field) => [field, serviceData[field]]),
  );
  return servicesRepository.create(cleanData);
};

const updateService = (id, updatedData) => {
  const { id: _ignored, ...changes } = updatedData;
  return servicesRepository.update(id, changes);
};

const deleteService = (id) => servicesRepository.delete(id);

export default {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
