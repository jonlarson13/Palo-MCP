import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerUserIdTools(server: McpServer) {
  server.tool(
    "get_userid_mappings",
    "[READ-ONLY] Retrieves IP-to-user mappings from User-ID, showing which users are mapped to which IP addresses. Executes: show user ip-user-mapping all.",
    {},
    async () => {
      const result = await executeOpCommand("<show><user><ip-user-mapping><all></all></ip-user-mapping></user></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_userid_groups",
    "[READ-ONLY] Retrieves user groups known to the firewall via User-ID. Executes: show user group list.",
    {},
    async () => {
      const result = await executeOpCommand("<show><user><group><list></list></group></user></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_userid_config",
    "[READ-ONLY] Retrieves User-ID configuration settings including agent configuration and group mapping. Reads config at: /config/.../vsys/entry/user-id-agent.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/user-id-agent");
      return formatResponse(result);
    }
  );
}
