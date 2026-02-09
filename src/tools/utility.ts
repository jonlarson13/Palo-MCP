import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerUtilityTools(server: McpServer) {
  server.tool(
    "run_op_command",
    "Execute a custom XML operational command on the firewall",
    {
      command: z.string().describe("XML operational command to execute (e.g., '<show><system><info></info></system></show>')"),
    },
    async ({ command }) => {
      const result = await executeOpCommand(command);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_config_xpath",
    "Get configuration at a specific XPath location",
    {
      xpath: z.string().describe("XPath to the configuration element (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/network')"),
    },
    async ({ xpath }) => {
      const result = await getConfig(xpath);
      return formatResponse(result);
    }
  );
}
