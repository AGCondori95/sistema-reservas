import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// En ESM no existe __dirname nativo, hay que reconstruirlo a partir de import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "services.json");

// Campos que TODO servicio necesita para ser válido
const REQUIRED_FIELDS = [
  "name",
  "description",
  "duration",
  "price",
  "category",
  "available",
];

class ServiceManager {
  constructor() {
    // Se lee el JSON una sola vez, al crear la instancia, y se guarda en memoria.
    // Si el archivo no existe o tiene JSON inválido, esto explota acá (a propósito:
    // preferible que falle al arrancar y no silenciosamente más tarde).
    const fileContent = fs.readFileSync(dataPath, "utf8");
    this.services = JSON.parse(fileContent);
  }

  #save() {
    fs.writeFileSync(dataPath, JSON.stringify(this.services, null, 2));
  }

  getServices() {
    return this.services;
  }

  getServiceById(id) {
    // Number(id): así funciona igual si te pasan "2" (string, típico si viene de una URL) o 2
    const service = this.services.find((s) => s.id === Number(id));
    return service ?? null;
  }

  addService(serviceData) {
    // Presencia, no "verdad": duration=0 o available=false son valores válidos,
    // por eso se chequea === undefined y no un simple if(!campo)
    const missing = REQUIRED_FIELDS.filter(
      (field) => serviceData[field] === undefined,
    );
    if (missing.length > 0) {
      return { error: `Faltan campos: ${missing.join(", ")}` };
    }

    // El id se genera acá adentro. Nunca se toma serviceData.id aunque venga.
    const newId =
      this.services.length > 0
        ? Math.max(...this.services.map((s) => s.id)) + 1
        : 1;

    const newService = {
      id: newId,
      ...Object.fromEntries(
        REQUIRED_FIELDS.map((field) => [field, serviceData[field]]),
      ),
    };

    this.services.push(newService);
    this.#save();
    return newService;
  }

  updateService(id, updatedData) {
    const index = this.services.findIndex((s) => s.id === Number(id));
    if (index === -1) return null;

    // Se descarta cualquier "id" que venga en updatedDate, así nunca lo pisa
    const { id: _ignored, ...changes } = updatedData;
    this.services[index] = { ...this.services[index], ...changes };
    this.#save();
    return this.services[index];
  }

  deleteService(id) {
    const index = this.services.findIndex((s) => s.id === Number(id));
    if (index === -1) return null;

    const [deleted] = this.services.splice(index, 1);
    this.#save();
    return deleted;
  }
}

export default ServiceManager;
