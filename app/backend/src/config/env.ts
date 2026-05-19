
import 'dotenv/config';
    import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

import {z} from "zod";

const node_env_enum = z.enum(["development", "production", "test"]);

export const envSchema = z.object({
  NODE_ENV: node_env_enum.default("development"),
  DATABASE_URL: z.string(),
//   JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  PORT: z.coerce.number().default(5000),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("dev_password_secure_123"),
  POSTGRES_DB: z.string().default("chat_app_dev"),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),

});

export const env = envSchema.parse(process.env);
