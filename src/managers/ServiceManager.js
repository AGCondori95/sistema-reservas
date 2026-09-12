import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

// En ESM no existe __dirname, lo reconstruimos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo de datos (subimos de /managers a /src y entramos a /data)
const dataPath = path.join(__dirname, "..", "data", "services.json");

class ServiceManager {
  constructor() {
    // Leemos el JSON UNA vez y lo guardamos en memoria como array
    const fileContent = fs.readFileSync(dataPath, "utf-8");
    this.services = JSON.parse(fileContent);
  }

  getServices() {
    return this.services;
  }

  getServiceById(id) {
    const service = this.services.find((s) => s.id === Number(id));
    return service || null;
  }

  addService(serviceData) {
    // 1) Campos obligatorios
    const requiredFields = [
      "name",
      "description",
      "duration",
      "price",
      "category",
      "available",
    ];

    // 2) Detectamos cuáles faltan en lo que llegó
    const missing = requiredFields.filter(
      (field) => serviceData[field] === undefined,
    );

    if (missing.length > 0) {
      return { error: `Faltan campos: ${missing.join(", ")}` };
    }

    // 3) Generamos el id automáticamente
    const newId =
      this.services.length > 0
        ? Math.max(...this.services.map((s) => s.id)) + 1
        : 1;

    // 4) Armamos el servicio nuevo
    const newService = {
      id: newId,
      name: serviceData.name,
      description: serviceData.description,
      duration: serviceData.duration,
      price: serviceData.price,
      category: serviceData.category,
      available: serviceData.available,
    };

    // 5) Lo agregamos al array en memoria
    this.services.push(newService);
    return newService;
  }

  updateService(id, updatedData) {
    // 1) Buscamos la posición del servicio en el array
    const index = this.services.findIndex((s) => s.id === Number(id));

    // 2) Si no existe, devolvemos null
    if (index === -1) {
      return null;
    }

    // 3) Sacamos el id de updatedData para que NO se pueda modificar
    const { id: _ignorado, ...cambios } = updatedData;

    // 4) Combinamos el servicio actual con los cambios (el id original se conserva)
    this.services[index] = { ...this.services[index], ...cambios };

    return this.services[index];
  }

  deleteService(id) {
    const index = this.services.findIndex((s) => s.id === Number(id));

    if (index === -1) {
      return null;
    }

    // splice devuelve un array con lo eliminado; tomamos el primer elemento
    const [eliminado] = this.services.splice(index, 1);
    return eliminado;
  }
}

export default ServiceManager;
