import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerAdminTools(server: McpServer) {
  server.tool(
    "get_admins",
    "Get all administrator accounts configured on the firewall",
    {},
    async () => {
      const result = await getConfig("/config/mgt-config/users");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_admin_roles",
    "Get administrator role definitions and their permissions",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/admin-role");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_auth_profiles",
    "Get authentication profiles including RADIUS, LDAP, TACACS+ configurations",
    {},
    async () => {
      const result = await getConfig("/config/shared/authentication-profile");
      return formatResponse(result);
    }
  );
}
