import servicesService from "../services/services.service.js";

export const getServices = (req, res) => {
  const services = servicesService.getServices(req.query);
  res.json(services);
};

export const getServiceById = (req, res) => {
  const service = servicesService.getServiceById(req.params.sid);
  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(service);
};

export const createService = (req, res) => {
  const result = servicesService.createService(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
};

export const updateService = (req, res) => {
  const updated = servicesService.updateService(req.params.sid, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(updated);
};

export const deleteService = (req, res) => {
  const deleted = servicesService.deleteService(req.params.sid);
  if (!deleted) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(deleted);
};
