import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerCertificatesTools(server: McpServer) {
  server.tool(
    "get_certificates",
    "Get SSL/TLS certificates configured on the firewall",
    {},
    async () => {
      const result = await getConfig("/config/shared/certificate");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_rules",
    "Get SSL decryption policy rules",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/decryption/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_profiles",
    "Get SSL decryption profiles",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/decryption");
      return formatResponse(result);
    }
  );
}
