import { serviceManager } from "../managers/instances.js";

export const getServices = (req, res) => {
  let services = serviceManager.getServices();
  const { category, available } = req.query;

  if (category) {
    services = services.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (available !== undefined) {
    const isAvailable = available === "true";
    services = services.filter((s) => s.available === isAvailable);
  }

  res.json(services);
};

export const getServiceById = (req, res) => {
  const service = serviceManager.getServiceById(req.params.sid);
  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(service);
};

export const createService = (req, res) => {
  const result = serviceManager.addService(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
};

export const updateService = (req, res) => {
  const updated = serviceManager.updateService(req.params.sid, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(updated);
};

export const deleteService = (req, res) => {
  const deleted = serviceManager.deleteService(req.params.sid);
  if (!deleted) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(deleted);
};
