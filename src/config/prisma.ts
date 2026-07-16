import { PrismaClient } from "@prisma/client";

// Why a singleton? Every time ts-node-dev hot-reloads your code,
// a fresh `new PrismaClient()` would open a new database connection
// pool without closing the old one — you'd quickly run out of
// connections. Creating exactly one instance here and importing it
// everywhere else avoids that.
//
// Fiber/Go comparison: this is the same reason you'd keep a single
// global *gorm.DB instance instead of calling gorm.Open() in every
// handler.
export const prisma = new PrismaClient();