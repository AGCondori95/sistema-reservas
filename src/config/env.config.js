import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "NODE_ENV"];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    `❌ Faltan variables de entorno requeridas: ${missing.join(", ")}`,
  );
  process.exit(1); // corta el proceso, no lanza excepción: esto es un guard de arranque, no un error recuperable
}

export const config = {
  port: Number(process.env.PORT), // number, porque después lo vas a usar para levantar un server
  nodeEnv: process.env.NODE_ENV,
};
