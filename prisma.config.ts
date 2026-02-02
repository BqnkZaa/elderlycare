/**
 * Prisma Configuration for Elderly Care Platform
 * 
 * Database URL is configured here for Prisma 7.x compatibility.
 * Update DATABASE_URL in your .env file with your MySQL connection string.
 */

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // MySQL connection URL from environment
    // Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
    url: process.env["DATABASE_URL"],
  },
});
