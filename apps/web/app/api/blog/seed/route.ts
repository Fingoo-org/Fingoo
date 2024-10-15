import { createKysely } from '@vercel/postgres-kysely';
import { Database, seedData } from '../data';
import { sql } from 'kysely';

const db = createKysely<Database>();

export async function GET(request: Request) {
  await db.schema
    .createTable('post')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute();

  await db.insertInto('post').values(seedData).execute();

  return Response.json({ message: 'success' });
}
