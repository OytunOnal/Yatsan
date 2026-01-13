import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

// PostgreSQL bağlantı URL'i
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:co4se+9e@localhost:5432/yatsan';

// PostgreSQL client oluştur
const client = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Drizzle client oluştur
export const db = drizzle(client, { schema });

// Bağlantıyı kapatmak için (testlerde kullanılabilir)
export const closeConnection = async () => {
  await client.end();
};

// Type-safe query builder için schema export
export * from '../db/schema';
