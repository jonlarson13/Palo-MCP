import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

export function registerCertificatesTools(server: McpServer) {
  server.tool(
    "get_certificates",
    "[READ-ONLY] Retrieves SSL/TLS certificates configured on the firewall. Reads config at: /config/shared/certificate.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/certificate", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_rules",
    "[READ-ONLY] Retrieves SSL decryption policy rules. Reads config at: /config/.../rulebase/decryption/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/decryption/rules", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_decryption_profiles",
    "[READ-ONLY] Retrieves SSL decryption profiles. Reads config at: /config/.../profiles/decryption.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/decryption", target);
      return formatResponse(result);
    }
  );
}
