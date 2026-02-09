import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { nlogsSchema, logQuery, firewallName } from "../schemas/panos.js";

export function registerLogsTools(server: McpServer) {
  server.tool(
    "get_traffic_logs",
    "[READ-ONLY] Retrieves recent traffic logs from the firewall. Executes: show log traffic. Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( addr.src in 10.0.0.0/8 )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const limit = nlogs || 20;
      let cmd = `<show><log><traffic><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</traffic></log></show>`;
      const result = await executeOpCommand(cmd, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_threat_logs",
    "[READ-ONLY] Retrieves recent threat logs from the firewall. Executes: show log threat. Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( severity eq critical )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const limit = nlogs || 20;
      let cmd = `<show><log><threat><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</threat></log></show>`;
      const result = await executeOpCommand(cmd, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_system_logs",
    "[READ-ONLY] Retrieves recent system logs from the firewall. Executes: show log system. Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query (e.g., '( severity eq critical )')"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const limit = nlogs || 20;
      let cmd = `<show><log><system><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</system></log></show>`;
      const result = await executeOpCommand(cmd, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_config_logs",
    "[READ-ONLY] Retrieves recent configuration change logs from the firewall. Executes: show log config. Supports filtering by query and limiting result count.",
    {
      nlogs: nlogsSchema,
      query: logQuery.describe("Filter query"),
      firewall: firewallName,
    },
    async ({ nlogs, query, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const limit = nlogs || 20;
      let cmd = `<show><log><config><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</config></log></show>`;
      const result = await executeOpCommand(cmd, target);
      return formatResponse(result);
    }
  );
}
