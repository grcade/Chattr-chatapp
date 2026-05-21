import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../src/config/env.js';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';

import {
  chats,
  conversationParticipants,
  conversations,
  users,
} from '../src/db/schema/index.js';

const seedDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(seedDir, '..', '..', '..');
const repoRoot = join(backendRoot, '..', '..');

type SeedUser = typeof users.$inferInsert;
type SeedConversation = typeof conversations.$inferInsert;
type SeedParticipant = typeof conversationParticipants.$inferInsert;
type SeedChat = typeof chats.$inferInsert;

type SeedData = {
  users: SeedUser[];
  conversations: SeedConversation[];
  conversationParticipants: SeedParticipant[];
  chats: SeedChat[];
};

const dataDir = join(seedDir, 'data');

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = join(dataDir, fileName);
  const fileContents = await readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

function toDate(value: string | Date | null | undefined): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  return new Date(value);
}

async function loadSeedData(): Promise<SeedData> {
  const [usersData, conversationsData, participantsData, chatsData] =
    await Promise.all([
      readJsonFile<SeedUser[]>('users.json'),
      readJsonFile<SeedConversation[]>('conversations.json'),
      readJsonFile<SeedParticipant[]>('conversation_participants.json'),
      readJsonFile<SeedChat[]>('chats.json'),
    ]);

  return {
    users: usersData.map((u) => ({
      ...u,
      created_at: toDate(u.created_at),
    })),
    conversations: conversationsData.map((c) => ({
      ...c,
      created_at: toDate(c.created_at),
      updated_at: toDate(c.updated_at),
    })),
    conversationParticipants: participantsData.map((p) => ({
      ...p,
      joined_at: toDate(p.joined_at),
    })),
    chats: chatsData.map((m) => ({
      ...m,
      created_at: toDate(m.created_at),
    })),
  };
}

function getLatestChatIdByConversation(chatsData: SeedChat[]) {
  const latestChatIds = new Map<string, string>();

  for (const chat of chatsData) {
    latestChatIds.set(chat.conversation_id, chat.id);
  }

  return latestChatIds;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const seedData = await loadSeedData();

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          users: seedData.users.length,
          conversations: seedData.conversations.length,
          conversationParticipants: seedData.conversationParticipants.length,
          chats: seedData.chats.length,
        },
        null,
        2
      )
    );
    return;
  }

  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    await db.transaction(async (tx) => {
      await tx.delete(chats);
      await tx.delete(conversationParticipants);
      await tx.delete(conversations);
      await tx.delete(users);

      if (seedData.users.length > 0) {
        await tx.insert(users).values(seedData.users);
      }

      if (seedData.conversations.length > 0) {
        await tx.insert(conversations).values(seedData.conversations);
      }

      if (seedData.conversationParticipants.length > 0) {
        await tx
          .insert(conversationParticipants)
          .values(seedData.conversationParticipants);
      }

      if (seedData.chats.length > 0) {
        await tx.insert(chats).values(seedData.chats);
      }

      const latestChatIds = getLatestChatIdByConversation(seedData.chats);

      for (const [conversationId, lastMessageId] of latestChatIds.entries()) {
        await tx
          .update(conversations)
          .set({ last_message_id: lastMessageId })
          .where(eq(conversations.id, conversationId));
      }
    });

    console.log('Seed completed successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
