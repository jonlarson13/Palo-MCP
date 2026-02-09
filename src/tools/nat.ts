import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerNatTools(server: McpServer) {
  server.tool(
    "get_nat_rules",
    "Get all NAT policy rules including source NAT, destination NAT, and bidirectional rules",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/nat/rules");
      return formatResponse(result);
    }
  );
}
