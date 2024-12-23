import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  API_PORT: z.string().default('3000'),
  DB_HOST: z.string().default('localhost'),
  DB_NAME: z.string().default('ozmap'),
  DB_PORT: z.string().default('27017'),
  GEOCODING_API_URL: z
    .string()
    .url()
    .default('https://nominatim.openstreetmap.org/search'),
  REVERSE_API_URL: z
    .string()
    .url()
    .default('https://nominatim.openstreetmap.org/reverse'),
});

const envServer = envSchema.safeParse(process.env);

if (!envServer.success) {
  console.error(
    'There is an error with the server environment variables',
    envServer.error.issues
  );
  process.exit(1);
}

export const envServerSchema = envServer.data;
