# Sistema de Reservas — Administrador de Servicios

Backend inicial de un sistema de turnos y reservas hecho con **Node.js** y **ESM** (`import`/`export`). Implementa `ServiceManager`, una clase que gestiona en memoria los servicios que ofrece el negocio (alta, baja, modificación y consulta).

Es una pre-entrega: todavía no hay servidor HTTP ni base de datos persistente. El foco es `ServiceManager` y una configuración de proyecto ordenada con validación de variables de entorno.

## Requisitos

- Node.js 18 o superior

## Instalación

```bash
git clone https://github.com/AGCondori95/sistema-reservas.git
cd sistema_reservas
npm install
```

## Variables de entorno

El proyecto valida al iniciar que existan estas variables (ver \`src/config/env.config.js\`). Si falta alguna, corta con un mensaje de error y código de salida 1.

```bash
cp .env.example .env
```

| Variable   | Descripción             | Ejemplo       |
| ---------- | ----------------------- | ------------- |
| `PORT`     | Puerto de la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución    | `development` |

## Ejecución

```bash
npm start # ejecuta src/app.js una vez
npm run dev # se reinicia al detectar cambios
```

## Recurso: `services`

Cada servicio tiene esta forma:

| Campo         | Tipo    | Descripción                         |
| ------------- | ------- | ----------------------------------- |
| `id`          | number  | Identificador único, se genera solo |
| `name`        | string  | Nombre del servicio                 |
| `description` | string  | Descripción del servicio            |
| `duration`    | number  | Duración en minutos                 |
| `price`       | number  | Precio                              |
| `category`    | string  | Categoría                           |
| `available`   | boolean | Si está disponible para reservar    |

## Endpoints

Base URL local: `http://localhost:8080/api/services`

| Método | Ruta                 | Descripción                                                |
| ------ | -------------------- | ---------------------------------------------------------- |
| GET    | `/api/services`      | Todos los servicios. Filtros: `?category=`, `?available=`  |
| GET    | `/api/services/:sid` | Servicio por id. `200` si existe, `404` si no              |
| POST   | `/api/services`      | Crea un servicio. `201` si se crea, `400` si faltan campos |
| PUT    | `/api/services/:sid` | Actualiza (no permite cambiar `id`). `200` o `404`         |
| DELETE | `/api/services/:sid` | Elimina. `200` o `404`                                     |

### Ejemplos

```bash
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=Estética&available=true"
curl http://localhost:8080/api/services/2

curl -X POST http://localhost:8080/api/services \\
-H "Content-Type: application/json" \\
-d '{"name":"Depilación","description":"Cera","duration":40,"price":5000,"category":"Estética","available":true}'

curl -X PUT http://localhost:8080/api/services/1 \\
-H "Content-Type: application/json" \\
-d '{"price":9999}'

curl -X DELETE http://localhost:8080/api/services/2
```

## Métodos de `ServiceManager`

```javascript
import ServiceManager from "./src/managers/ServiceManager.js";

const manager = new ServiceManager();

manager.getServices();
// -> array con todos los servicios

manager.getServiceById(2);
// -> el servicio, o null si no existe

manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 5000,
  category: "Estética",
  available: true,
});
// -> el servicio creado con id autogenerado
// si falta un campo: { error: "Faltan campos: ..." }

manager.updateService(1, { price: 9999, id: 777 });
// -> el servicio actualizado (el id nunca cambia); null si no existe

manager.deleteService(2);
// -> el servicio eliminado, o null si no existe
```

## Estructura del proyecto

```
src/
config/env.config.js # Carga y valida variables de entorno
managers/ServiceManager.js # Lógica de gestión de servicios
data/services.json # Datos iniciales
app.js # Punto de entrada / pruebas manuales
.env.example
.gitignore
package.json
README.md
```
