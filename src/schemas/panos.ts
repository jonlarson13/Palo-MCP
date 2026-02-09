import { z } from "zod";

export const configXpath = z
  .string()
  .startsWith("/config")
  .describe("XPath to a configuration location (must start with '/config')");

export const deviceGroup = z
  .string()
  .min(1)
  .describe("Name of the device group");

export const nlogsSchema = z
  .number()
  .int()
  .min(1)
  .max(5000)
  .optional()
  .describe("Number of logs to retrieve (default: 20, max: 5000)");

export const xmlElement = z
  .string()
  .min(1)
  .startsWith("<")
  .describe("XML element string (must start with '<')");

export const xmlCommand = z
  .string()
  .min(1)
  .startsWith("<")
  .describe("XML operational command (must start with '<')");

export const commitDescription = z
  .string()
  .max(512)
  .optional()
  .describe("Optional commit description/comment");

export const partialAdmin = z
  .string()
  .min(1)
  .max(63)
  .optional()
  .describe("Commit only changes made by this admin user");

export const logQuery = z
  .string()
  .max(2048)
  .optional()
  .describe("Filter query for log retrieval");
