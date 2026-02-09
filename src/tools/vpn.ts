import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerVpnTools(server: McpServer) {
  server.tool(
    "get_ipsec_tunnels",
    "Get IPSec VPN tunnel status and security associations",
    {},
    async () => {
      const result = await executeOpCommand("<show><vpn><ipsec-sa></ipsec-sa></vpn></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_globalprotect_users",
    "Get currently connected GlobalProtect VPN users",
    {},
    async () => {
      const result = await executeOpCommand("<show><global-protect-gateway><current-user></current-user></global-protect-gateway></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_globalprotect_config",
    "Get GlobalProtect gateway and portal configuration",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/global-protect");
      return formatResponse(result);
    }
  );
}
