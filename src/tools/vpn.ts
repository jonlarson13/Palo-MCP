import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerVpnTools(server: McpServer) {
  server.tool(
    "get_ipsec_tunnels",
    "[READ-ONLY] Retrieves IPSec VPN tunnel status and security associations. Executes: show vpn ipsec-sa.",
    {},
    async () => {
      const result = await executeOpCommand("<show><vpn><ipsec-sa></ipsec-sa></vpn></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_globalprotect_users",
    "[READ-ONLY] Retrieves currently connected GlobalProtect VPN users. Executes: show global-protect-gateway current-user.",
    {},
    async () => {
      const result = await executeOpCommand("<show><global-protect-gateway><current-user></current-user></global-protect-gateway></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_globalprotect_config",
    "[READ-ONLY] Retrieves GlobalProtect gateway and portal configuration. Reads config at: /config/.../vsys/entry/global-protect.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/global-protect");
      return formatResponse(result);
    }
  );
}
