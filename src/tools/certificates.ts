import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerCertificatesTools(server: McpServer) {
  server.tool(
    "get_certificates",
    "[READ-ONLY] Retrieves SSL/TLS certificates configured on the firewall. Reads config at: /config/shared/certificate.",
    {},
    async () => {
      const result = await getConfig("/config/shared/certificate");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_rules",
    "[READ-ONLY] Retrieves SSL decryption policy rules. Reads config at: /config/.../rulebase/decryption/rules.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/decryption/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_profiles",
    "[READ-ONLY] Retrieves SSL decryption profiles. Reads config at: /config/.../profiles/decryption.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/decryption");
      return formatResponse(result);
    }
  );
}
