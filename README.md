# Sistema de Reservas — Administrador de Servicios

Backend inicial de un sistema de turnos y reservas, hecho con **Node.js** y **ESM** (módulos `import`/`export`). Implementa una clase `ServiceManager` que gestiona en memoria los servicios que ofrece el negocio (crear, leer, actualizar y eliminar).

Es una **pre-entrega**: todavía no hay servidor HTTP ni base de datos. El foco está en la clase `ServiceManager` y en una configuración de proyecto ordenada.

## Requisitos

- Node.js 18 o superior

## Instalación

```bash
git clone <URL-de-tu-repo>
cd sistema_reservas
npm install
```

## Configuración (variables de entorno)

El proyecto valida al iniciar que existan estas variables. Copiá `.env.example` a `.env` y completá los valores:

```bash
cp .env.example .env
```

| Variable   | Descripción             | Ejemplo       |
| ---------- | ----------------------- | ------------- |
| `PORT`     | Puerto de la aplicación | `8080`        |
| `NODE_ENV` | Entorno de ejecución    | `development` |

Si falta alguna variable requerida, la app corta con un mensaje de error.

## Ejecución

```bash
npm start      # ejecuta la app una vez
npm run dev    # modo desarrollo, se reinicia al detectar cambios
```

## Recurso: `services`

Cada servicio tiene esta forma:

| Campo         | Tipo    | Descripción                          |
| ------------- | ------- | ------------------------------------ |
| `id`          | number  | Identificador único (se genera solo) |
| `name`        | string  | Nombre del servicio                  |
| `description` | string  | Descripción del servicio             |
| `duration`    | number  | Duración en minutos                  |
| `price`       | number  | Precio                               |
| `category`    | string  | Categoría                            |
| `available`   | boolean | Si está disponible para reservar     |

## Métodos de `ServiceManager`

```javascript
import ServiceManager from "./src/managers/ServiceManager.js";

const manager = new ServiceManager();

// Listar todos los servicios
manager.getServices();

// Buscar por id (devuelve el servicio o null)
manager.getServiceById(2);

// Agregar un servicio (el id se genera automáticamente)
manager.addService({
  name: "Depilación",
  description: "Depilación con cera",
  duration: 40,
  price: 5000,
  category: "Estética",
  available: true,
});
// Si falta un campo, devuelve: { error: 'Faltan campos: ...' }

// Actualizar (no permite modificar el id; devuelve null si no existe)
manager.updateService(1, { price: 9999 });

// Eliminar (devuelve el servicio eliminado o null si no existe)
manager.deleteService(2);
```

## Estructura del proyecto

```
src/
  config/env.config.js     # Carga y valida variables de entorno
  managers/ServiceManager.js  # Lógica de gestión de servicios
  data/services.json          # Datos iniciales
  app.js                      # Punto de entrada / pruebas
.env.example
.gitignore
package.json
README.md
```
