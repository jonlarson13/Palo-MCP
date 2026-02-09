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
