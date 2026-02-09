import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerAdminTools(server: McpServer) {
  server.tool(
    "get_admins",
    "[READ-ONLY] Retrieves all administrator accounts configured on the firewall. Reads config at: /config/mgt-config/users.",
    {},
    async () => {
      const result = await getConfig("/config/mgt-config/users");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_admin_roles",
    "[READ-ONLY] Retrieves administrator role definitions and their permissions. Reads config at: /config/.../vsys/entry/admin-role.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/admin-role");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_auth_profiles",
    "[READ-ONLY] Retrieves authentication profiles including RADIUS, LDAP, and TACACS+ configurations. Reads config at: /config/shared/authentication-profile.",
    {},
    async () => {
      const result = await getConfig("/config/shared/authentication-profile");
      return formatResponse(result);
    }
  );
}
