import dotenv from "dotenv";

// 1) Carga las variables del archivo .env dentro de process.env
dotenv.config();

// 2) Lista de variables que el proyecto NECESITA para funcionar
const requiredEnvVars = ["PORT", "NODE_ENV"];

// 3) Detecta cuáles faltan
const missing = requiredEnvVars.filter((key) => !process.env[key]);

// 4) Si falta alguna, cortamos la app con un mensaje claro
if (missing.length > 0) {
  console.error(`❌ Faltan variables de entorno: ${missing.join(", ")}`);
  process.exit(1); // Termina el proceso con código de error
}

// 5) Exportamos un objeto config ya listo para usar en el resto del proyecto
export const config = { port: process.env.PORT, nodeEnv: process.env.NODE_ENV };
