import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerUserIdTools(server: McpServer) {
  server.tool(
    "get_userid_mappings",
    "Get IP to user mappings from User-ID (shows which users are mapped to which IP addresses)",
    {},
    async () => {
      const result = await executeOpCommand("<show><user><ip-user-mapping><all></all></ip-user-mapping></user></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_userid_groups",
    "Get user groups known to the firewall via User-ID",
    {},
    async () => {
      const result = await executeOpCommand("<show><user><group><list></list></group></user></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_userid_config",
    "Get User-ID configuration settings including agent configuration and group mapping",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/user-id-agent");
      return formatResponse(result);
    }
  );
}
