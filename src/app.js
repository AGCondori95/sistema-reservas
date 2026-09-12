import { config } from "./config/env.config.js";
import ServiceManager from "./managers/ServiceManager.js";

console.log("✅ App iniciada en modo:", config.nodeEnv);
console.log("🔌 Puerto configurado:", config.port);
console.log("----------------------------------------");

// Creamos una instancia del manager
const manager = new ServiceManager();

// 1) Listar todos
console.log("📋 Todos los servicios:", manager.getServices());

// 2) Buscar por id
console.log("🔍 Servicio id=2:", manager.getServiceById(2));
console.log("🔍 Servicio inexistente id=99:", manager.getServiceById(99));

// 3) Agregar uno nuevo (sin pasar id)
const nuevo = manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 5000,
  category: "Estética",
  available: true,
});
console.log("➕ Servicio agregado:", nuevo);

// 4) Intentar agregar uno incompleto (debe rechazar)
const incompleto = manager.addService({ name: "Solo nombre" });
console.log("⚠️  Servicio incompleto:", incompleto);

// 5) Actualizar (intentando cambiar el id: no debe permitirlo)
const actualizado = manager.updateService(1, { price: 9999, id: 777 });
console.log("✏️  Servicio actualizado (id NO cambia):", actualizado);

// 6) Eliminar
const eliminado = manager.deleteService(2);
console.log("🗑️  Servicio eliminado:", eliminado);

// 7) Estado final
console.log("📋 Estado final:", manager.getServices());
