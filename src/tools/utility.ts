import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerUtilityTools(server: McpServer) {
  server.tool(
    "run_op_command",
    "[ADVANCED] Executes an arbitrary PanOS operational XML command. The command will be sent directly to the firewall API. Use with caution — the command could be read-only or state-modifying depending on its content.",
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
    "[READ-ONLY] Retrieves configuration at a specific XPath location. This is a flexible read tool for querying any part of the PanOS configuration tree.",
    {
      xpath: z.string().describe("XPath to the configuration element (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/network')"),
    },
    async ({ xpath }) => {
      const result = await getConfig(xpath);
      return formatResponse(result);
    }
  );
}
