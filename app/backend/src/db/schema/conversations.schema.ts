import {pgTable, uuid, varchar, pgEnum, index, type AnyPgColumn,  } from "drizzle-orm/pg-core";
import { timestamps } from "../../utils/timestamps.js";
import  {users } from "./user.schema.js";
import  {chats } from "./chat.schema.js";

export const conversation_type_enum = pgEnum("conversation_type", ["private", "group"]);


 export const conversations = pgTable("conversations", {
    id: uuid("id").primaryKey().notNull(),
    name: varchar("name", { length: 255 }),
    type: conversation_type_enum().default("private").notNull(),
        last_message_id: uuid("last_message_id").references(() : AnyPgColumn => chats.id, { onDelete: "set null" }),
    ...timestamps
}, (table) => {
    return {
        nameIndex: index("name_index").on(table.name),

    }
});
