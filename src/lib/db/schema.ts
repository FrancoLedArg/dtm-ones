import {
  pgTable,
  pgEnum,
  serial,
  text,
  integer,
  varchar,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth Entities

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// End of Better Auth Entities

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 150 }),
  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  height: varchar("height", { length: 20 }),
  dateOfBirth: varchar("date_of_birth", { length: 50 }),
  nationality: varchar("nationality", { length: 100 }),
  lastClub: varchar("last_club", { length: 150 }),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const playerRelation = relations(players, ({ one, many }) => ({
  playerMedia: many(playerMedia),
  playerCategories: many(playerCategories),
}));

export const playerMediaTypes = pgEnum("player_media_types", [
  "image",
  "video",
]);

export const playerMedia = pgTable("player_media", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id")
    .references(() => players.id)
    .notNull(),
  mediaType: playerMediaTypes("media_type").notNull(),
  url: text("url").notNull(),
  description: text("description"),
});

export const playerMediaRelation = relations(playerMedia, ({ one }) => ({
  player: one(players, {
    fields: [playerMedia.playerId],
    references: [players.id],
  }),
}));

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  bannerUrl: text("banner_url"),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const categoriesRelation = relations(categories, ({ many }) => ({
  players: many(players),
}));

export const playerCategories = pgTable(
  "player_categories",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.playerId, table.categoryId] })],
);

export const playerCategoriesRelation = relations(
  playerCategories,
  ({ one }) => ({
    player: one(players, {
      fields: [playerCategories.playerId],
      references: [players.id],
    }),
    category: one(categories, {
      fields: [playerCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
