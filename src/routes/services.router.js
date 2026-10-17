import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "../controllers/services.controller.js";

const router = Router();

router.get("/", getServices);
router.get("/:sid", getServiceById);
router.post("/", createService);
router.put("/:sid", updateService);
router.delete("/:sid", deleteService);

export default router;
