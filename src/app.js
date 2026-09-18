import { config } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

console.log(`App iniciada en modo ${config.nodeEnv}, puerto ${config.port}`);
console.log("----------------------------------------");

const manager = new ServiceManager();

console.log("Todos los servicios:", manager.getServices());
console.log("Servicio id=2:", manager.getServiceById(2));
console.log("Servicio inexistente id=99:", manager.getServiceById(99));

const nuevo = manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 5000,
  category: "Estética",
  available: true,
});
console.log("Servicio agregado:", nuevo);

const incompleto = manager.addService({ name: "Solo nombre" });
console.log("Servicio incompleto (rechazado):", incompleto);

const actualizado = manager.updateService(1, { price: 9999, id: 777 });
console.log("Servicio actualizado (id no cambia):", actualizado);

const eliminado = manager.deleteService(2);
console.log("Servicio eliminado:", eliminado);

console.log("Estado final:", manager.getServices());
