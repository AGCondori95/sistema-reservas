import { Router } from "express";
import ServiceManager from "../managers/ServiceManager.js";

const router = Router();
const manager = new ServiceManager();

// GET /api/services — todos, con filtros opcionales
router.get("/", (req, res) => {
  let services = manager.getServices();
  const { category, available } = req.query;

  if (category) {
    services = services.filter(
      (s) => s.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (available !== undefined) {
    // req.query.available siempre llega como string ("true"/"false")
    const isAvailable = available === "true";
    services = services.filter((s) => s.available === isAvailable);
  }

  res.json(services);
});

// GET /api/services/:sid
router.get("/:sid", (req, res) => {
  const service = manager.getServiceById(req.params.sid);
  if (!service) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(service);
});

// POST /api/services
router.post("/", (req, res) => {
  const result = manager.addService(req.body);
  if (result.error) {
    return res.status(400).json(result);
  }
  res.status(201).json(result);
});

// PUT /api/services/:sid
router.put("/:sid", (req, res) => {
  const updated = manager.updateService(req.params.sid, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(updated);
});

// DELETE /api/services/:sid
router.delete("/:sid", (req, res) => {
  const deleted = manager.deleteService(req.params.sid);
  if (!deleted) {
    return res.status(404).json({ error: "Servicio no encontrado" });
  }
  res.status(200).json(deleted);
});

export default router;
