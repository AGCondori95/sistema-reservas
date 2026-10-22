import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "..", "data", "services.json");

const readAll = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
const writeAll = (services) =>
  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2));

const getAll = () => readAll();

const getById = (id) => {
  const services = readAll();
  return services.find((s) => s.id === Number(id)) ?? null;
};

const create = (serviceData) => {
  const services = readAll();
  const newId =
    services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
  const newService = { id: newId, ...serviceData };
  services.push(newService);
  writeAll(services);
  return newService;
};

const update = (id, changes) => {
  const services = readAll();
  const index = services.findIndex((s) => s.id === Number(id));
  if (index === -1) return null;
  services[index] = { ...services[index], ...changes };
  writeAll(services);
  return services[index];
};

const deleteById = (id) => {
  const services = readAll();
  const index = services.findIndex((s) => s.id === Number(id));
  if (index === -1) return null;
  const [deleted] = services.splice(index, 1);
  writeAll(services);
  return deleted;
};

export default { getAll, getById, create, update, delete: deleteById };
