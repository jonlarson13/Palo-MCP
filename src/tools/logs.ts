import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeOpCommand, formatResponse } from "../api/client.js";

export function registerLogsTools(server: McpServer) {
  server.tool(
    "get_traffic_logs",
    "Get recent traffic logs from the firewall",
    {
      nlogs: z.number().optional().describe("Number of logs to retrieve (default: 20, max: 5000)"),
      query: z.string().optional().describe("Filter query (e.g., '( addr.src in 10.0.0.0/8 )')"),
    },
    async ({ nlogs, query }) => {
      const limit = nlogs || 20;
      let cmd = `<show><log><traffic><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</traffic></log></show>`;
      const result = await executeOpCommand(cmd);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_threat_logs",
    "Get recent threat logs from the firewall",
    {
      nlogs: z.number().optional().describe("Number of logs to retrieve (default: 20, max: 5000)"),
      query: z.string().optional().describe("Filter query (e.g., '( severity eq critical )')"),
    },
    async ({ nlogs, query }) => {
      const limit = nlogs || 20;
      let cmd = `<show><log><threat><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</threat></log></show>`;
      const result = await executeOpCommand(cmd);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_system_logs",
    "Get recent system logs from the firewall",
    {
      nlogs: z.number().optional().describe("Number of logs to retrieve (default: 20, max: 5000)"),
      query: z.string().optional().describe("Filter query (e.g., '( severity eq critical )')"),
    },
    async ({ nlogs, query }) => {
      const limit = nlogs || 20;
      let cmd = `<show><log><system><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</system></log></show>`;
      const result = await executeOpCommand(cmd);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_config_logs",
    "Get recent configuration change logs from the firewall",
    {
      nlogs: z.number().optional().describe("Number of logs to retrieve (default: 20, max: 5000)"),
      query: z.string().optional().describe("Filter query"),
    },
    async ({ nlogs, query }) => {
      const limit = nlogs || 20;
      let cmd = `<show><log><config><nlogs>${limit}</nlogs>`;
      if (query) {
        cmd += `<query>${query}</query>`;
      }
      cmd += `</config></log></show>`;
      const result = await executeOpCommand(cmd);
      return formatResponse(result);
    }
  );
}
