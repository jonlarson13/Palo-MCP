import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, formatResponse } from "../api/client.js";

export function registerLicensesTools(server: McpServer) {
  server.tool(
    "get_licenses",
    "[READ-ONLY] Retrieves license status and expiration dates for all features. Executes: request license info.",
    {},
    async () => {
      const result = await executeOpCommand("<request><license><info></info></license></request>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_license_usage",
    "[READ-ONLY] Retrieves license usage information including VM model, serial, capacity tier, and mode. Executes: show system info (extracts license fields).",
    {},
    async () => {
      const result = await executeOpCommand("<show><system><info></info></system></show>");
      if (result.success && result.data?.system) {
        const system = result.data.system;
        result.data = {
          "model": system["model"],
          "serial": system["serial"],
          "vm-license": system["vm-license"],
          "vm-mode": system["vm-mode"],
          "vm-cpuid": system["vm-cpuid"],
          "vm-uuid": system["vm-uuid"],
          "vm-capacity-tier": system["vm-capacity-tier"],
        };
      }
      return formatResponse(result);
    }
  );
}
