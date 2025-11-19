import { config } from 'dotenv';
import { join } from 'path';

export function loadEnvConfig(env: string) {
  const envFile = `.env.${env}`;
  const envPath = join(__dirname, '..', 'config', envFile);
  config({ path: envPath });
}
