import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeLogQuery, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { nlogsSchema, logQuery, firewallName } from "../schemas/panos.js";

export function registerLogsTools(server: McpServer) {
  server.tool(
    "get_traffic_logs",
    "[READ-ONLY] Retrieves recent traffic logs from the firewall using the PanOS log API (type=log). Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( addr.src in 10.0.0.0/8 )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeLogQuery("traffic", nlogs || 20, query, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_threat_logs",
    "[READ-ONLY] Retrieves recent threat logs from the firewall using the PanOS log API (type=log). Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( severity eq critical )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeLogQuery("threat", nlogs || 20, query, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_system_logs",
    "[READ-ONLY] Retrieves recent system logs from the firewall using the PanOS log API (type=log). Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( severity eq critical )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeLogQuery("system", nlogs || 20, query, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_config_logs",
    "[READ-ONLY] Retrieves recent configuration change logs from the firewall using the PanOS log API (type=log). Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeLogQuery("config", nlogs || 20, query, target);
      return formatResponse(result);
    }
  );
}
