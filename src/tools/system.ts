import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, formatResponse } from "../api/client.js";

export function registerSystemTools(server: McpServer) {
  server.tool(
    "get_firewall_info",
    "[READ-ONLY] Retrieves system information (hostname, model, serial, software version) from the PanOS firewall. Executes: show system info.",
    {},
    async () => {
      const result = await executeOpCommand("<show><system><info></info></system></show>");
      if (result.success && result.data?.system) {
        result.data = result.data.system;
      }
      return formatResponse(result);
    }
  );

  server.tool(
    "get_ha_status",
    "[READ-ONLY] Retrieves high-availability (HA) state and peer information from the firewall. Executes: show high-availability state.",
    {},
    async () => {
      const result = await executeOpCommand("<show><high-availability><state></state></high-availability></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_active_sessions",
    "[READ-ONLY] Retrieves active session count and summary from the firewall. Executes: show session info.",
    {},
    async () => {
      const result = await executeOpCommand("<show><session><info></info></session></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_system_resources",
    "[READ-ONLY] Retrieves system resource utilization including CPU, memory, and disk usage. Executes: show system resources.",
    {},
    async () => {
      const result = await executeOpCommand("<show><system><resources></resources></system></show>");
      return formatResponse(result);
    }
  );
}
