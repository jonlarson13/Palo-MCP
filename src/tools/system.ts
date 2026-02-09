import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, formatResponse } from "../api/client.js";

export function registerSystemTools(server: McpServer) {
  server.tool(
    "get_firewall_info",
    "Get system information from the PanOS firewall including hostname, model, serial, software version",
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
    "Get high-availability (HA) state and peer information from the firewall",
    {},
    async () => {
      const result = await executeOpCommand("<show><high-availability><state></state></high-availability></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_active_sessions",
    "Get active session count and summary from the firewall",
    {},
    async () => {
      const result = await executeOpCommand("<show><session><info></info></session></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_system_resources",
    "Get system resource utilization including CPU, memory, and disk usage",
    {},
    async () => {
      const result = await executeOpCommand("<show><system><resources></resources></system></show>");
      return formatResponse(result);
    }
  );
}
