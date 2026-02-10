import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

export function registerNatTools(server: McpServer) {
  server.tool(
    "get_nat_rules",
    "[READ-ONLY] Retrieves all NAT policy rules including source NAT, destination NAT, and bidirectional rules. Reads config at: /config/.../rulebase/nat/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/nat/rules", target);
      return formatResponse(result);
    }
  );
}
