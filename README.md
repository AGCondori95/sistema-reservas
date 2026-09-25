# Sistema de Reservas — Backend de Turnos y Reservas

Backend de un sistema de turnos y reservas hecho con **Node.js**, **Express** y **ESM** (`import`/`export`). Gestiona dos recursos — `services` y `bookings` — con persistencia en archivos JSON (`src/data/services.json` y `src/data/bookings.json`): los datos sobreviven a un reinicio del servidor.

## Requisitos

- Node.js 18 o superior

## Instalación

```bash
git clone https://github.com/AGCondori95/sistema-reservas.git
cd sistema_reservas
npm install
```

## Variables de entorno

El proyecto valida al iniciar que existan estas variables (ver `src/config/env.config.js`). Si falta alguna, corta con un mensaje de error y código de salida 1.

```bash
cp .env.example .env
```

| Variable   | Descripción             | Ejemplo       |
| ---------- | ----------------------- | ------------- |
| `PORT`     | Puerto de la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución    | `development` |

## Ejecución

```bash
npm start   # levanta el servidor Express (src/server.js) una vez
npm run dev # igual, pero se reinicia al detectar cambios en archivos .js
```

El servidor queda escuchando en `http://localhost:<PORT>` (por defecto `8080`).

## Recurso: `services`

| Campo         | Tipo    | Descripción                         |
| ------------- | ------- | ----------------------------------- |
| `id`          | number  | Identificador único, se genera solo |
| `name`        | string  | Nombre del servicio                 |
| `description` | string  | Descripción del servicio            |
| `duration`    | number  | Duración en minutos                 |
| `price`       | number  | Precio                              |
| `category`    | string  | Categoría                           |
| `available`   | boolean | Si está disponible para reservar    |

## Recurso: `bookings`

| Campo         | Tipo   | Descripción                                                     |
| ------------- | ------ | --------------------------------------------------------------- |
| `id`          | number | Identificador único, se genera solo                             |
| `clientName`  | string | Nombre del cliente                                              |
| `clientEmail` | string | Email del cliente                                               |
| `date`        | string | Fecha del turno                                                 |
| `time`        | string | Hora del turno                                                  |
| `status`      | string | Estado de la reserva (`"pending"` por default si no se envía)   |
| `services`    | array  | Servicios agregados: `{ service: <id del servicio>, quantity }` |

Una reserva se crea con `services: []` y se le van agregando servicios después. Si se agrega el mismo servicio dos veces, no se duplica la entrada: se incrementa `quantity`.

## Endpoints

Base URL local: `http://localhost:8080/api`

### Services

| Método | Ruta                 | Descripción                                                |
| ------ | -------------------- | ---------------------------------------------------------- |
| GET    | `/api/services`      | Todos los servicios. Filtros: `?category=`, `?available=`  |
| GET    | `/api/services/:sid` | Servicio por id. `200` si existe, `404` si no              |
| POST   | `/api/services`      | Crea un servicio. `201` si se crea, `400` si faltan campos |
| PUT    | `/api/services/:sid` | Actualiza (no permite cambiar `id`). `200` o `404`         |
| DELETE | `/api/services/:sid` | Elimina. `200` o `404`                                     |

### Bookings

| Método | Ruta                               | Descripción                                                               |
| ------ | ---------------------------------- | ------------------------------------------------------------------------- |
| POST   | `/api/bookings`                    | Crea una reserva (`services` puede iniciar vacío). `201` o `400`          |
| GET    | `/api/bookings/:bid`               | Reserva por id. `200` si existe, `404` si no                              |
| POST   | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva. Valida que ambos existan. `200` o `404` |

### Ejemplos

```bash
# services
curl http://localhost:8080/api/services
curl "http://localhost:8080/api/services?category=Estética&available=true"

curl -X POST http://localhost:8080/api/services \\
-H "Content-Type: application/json" \\
-d '{"name":"Depilación","description":"Cera","duration":40,"price":5000,"category":"Estética","available":true}'

# bookings
curl -X POST http://localhost:8080/api/bookings \\
-H "Content-Type: application/json" \\
-d '{"clientName":"Ana Perez","clientEmail":"ana@mail.com","date":"2026-10-01","time":"15:00"}'

curl http://localhost:8080/api/bookings/1

curl -X POST http://localhost:8080/api/bookings/1/services/1
```

## Managers

`ServiceManager` y `BookingManager` leen y escriben directo en sus archivos JSON (`src/data/services.json`, `src/data/bookings.json`) usando `node:fs`. Ambas instancias se crean una sola vez en `src/managers/instances.js` y se comparten entre routers, para que un servicio creado por un endpoint esté disponible de inmediato para el otro (por ejemplo, al validar `addServiceToBooking`).

```javascript
import { serviceManager, bookingManager } from "./src/managers/instances.js";

serviceManager.getServices();
serviceManager.addService({
  name: "...",
  description: "...",
  duration: 30,
  price: 1000,
  category: "...",
  available: true,
});

bookingManager.createBooking({
  clientName: "Ana",
  clientEmail: "ana@mail.com",
  date: "2026-10-01",
  time: "15:00",
});
bookingManager.addServiceToBooking(1, 1); // agrega el service id=1 a la booking id=1
```

## Estructura del proyecto

```
src/
app.js                       # Configura Express y monta los routers (sin lógica de negocio)
server.js                    # Arranca el servidor (app.listen)
config/env.config.js         # Carga y valida variables de entorno
managers/
instances.js               # Instancias únicas y compartidas de los managers
ServiceManager.js           # Lógica + persistencia de services.json
BookingManager.js           # Lógica + persistencia de bookings.json
routes/
services.router.js
bookings.router.js
data/
services.json
bookings.json
.env.example
.gitignore
package.json
README.md
```
