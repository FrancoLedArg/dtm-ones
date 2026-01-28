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
  playerPositions: many(playerPositions),
  playerRoles: many(playerRoles),
  playerContractStatuses: many(playerContractStatuses),
  playerAvailabilityStatuses: many(playerAvailabilityStatuses),
  playerDevelopmentStages: many(playerDevelopmentStages),
}));

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const positionsRelation = relations(positions, ({ many }) => ({
  players: many(players),
}));

export const playerPositions = pgTable(
  "player_positions",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    positionId: integer("position_id")
      .references(() => positions.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.playerId, table.positionId] })],
);

export const playerPositionsRelation = relations(
  playerPositions,
  ({ one }) => ({
    player: one(players, {
      fields: [playerPositions.playerId],
      references: [players.id],
    }),
    position: one(positions, {
      fields: [playerPositions.positionId],
      references: [positions.id],
    }),
  }),
);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const rolesRelation = relations(roles, ({ many }) => ({
  players: many(players),
}));

export const playerRoles = pgTable(
  "player_roles",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    roleId: integer("role_id")
      .references(() => roles.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.playerId, table.roleId] })],
);

export const playerRolesRelation = relations(playerRoles, ({ one }) => ({
  player: one(players, {
    fields: [playerRoles.playerId],
    references: [players.id],
  }),
  role: one(roles, {
    fields: [playerRoles.roleId],
    references: [roles.id],
  }),
}));

export const contractStatuses = pgTable("contract_statuses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const contractStatusesRelation = relations(
  contractStatuses,
  ({ many }) => ({
    players: many(players),
  }),
);

export const playerContractStatuses = pgTable(
  "player_contract_statuses",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    contractStatusId: integer("contract_status_id")
      .references(() => contractStatuses.id)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.contractStatusId] }),
  ],
);

export const playerContractStatusesRelation = relations(
  playerContractStatuses,
  ({ one }) => ({
    player: one(players, {
      fields: [playerContractStatuses.playerId],
      references: [players.id],
    }),
    contractStatus: one(contractStatuses, {
      fields: [playerContractStatuses.contractStatusId],
      references: [contractStatuses.id],
    }),
  }),
);

export const availabilityStatuses = pgTable("availability_statuses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const availabilityStatusesRelation = relations(
  availabilityStatuses,
  ({ many }) => ({
    players: many(players),
  }),
);

export const playerAvailabilityStatuses = pgTable(
  "player_availability_statuses",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    availabilityStatusId: integer("availability_status_id")
      .references(() => availabilityStatuses.id)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.availabilityStatusId] }),
  ],
);

export const playerAvailabilityStatusesRelation = relations(
  playerAvailabilityStatuses,
  ({ one }) => ({
    player: one(players, {
      fields: [playerAvailabilityStatuses.playerId],
      references: [players.id],
    }),
    availabilityStatus: one(availabilityStatuses, {
      fields: [playerAvailabilityStatuses.availabilityStatusId],
      references: [availabilityStatuses.id],
    }),
  }),
);

export const developmentStages = pgTable("development_stages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const developmentStagesRelation = relations(
  developmentStages,
  ({ many }) => ({
    players: many(players),
  }),
);

export const playerDevelopmentStages = pgTable(
  "player_development_stages",
  {
    playerId: integer("player_id")
      .references(() => players.id)
      .notNull(),
    developmentStageId: integer("development_stage_id")
      .references(() => developmentStages.id)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.playerId, table.developmentStageId] }),
  ],
);

export const playerDevelopmentStagesRelation = relations(
  playerDevelopmentStages,
  ({ one }) => ({
    player: one(players, {
      fields: [playerDevelopmentStages.playerId],
      references: [players.id],
    }),
    developmentStage: one(developmentStages, {
      fields: [playerDevelopmentStages.developmentStageId],
      references: [developmentStages.id],
    }),
  }),
);

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
