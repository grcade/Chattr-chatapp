import { pgTable, serial, text, uuid , timestamp, type AnyPgColumn, pgEnum, boolean} from "drizzle-orm/pg-core";
import {users} from "./user.schema.js";
import {conversations} from "./conversations.schema.js";


export const message_status_enum = pgEnum("message_status_enum", ["sent", "delivered", "read"]);


export const chats = pgTable("chats", {
    id: uuid("id").primaryKey().notNull(),
    message: text("message").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    sender_id: uuid("sender_id").notNull().references(() => users.id, {
      onDelete: "cascade",
    }),
    conversation_id: uuid("conversation_id").references((): AnyPgColumn => conversations.id, { onDelete: "cascade" }).notNull(),
    image_url: text("image_url"),
    status: message_status_enum().default("sent").notNull(),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    attachment_url: text("attachment_url"),


});
