import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerSecurityTools(server: McpServer) {
  server.tool(
    "get_security_rules",
    "[READ-ONLY] Retrieves all security policy rules from the firewall. Reads config at: /config/.../rulebase/security/rules.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/security/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profiles",
    "[READ-ONLY] Retrieves security profiles including antivirus, vulnerability, spyware, and URL filtering profiles. Reads config at: /config/.../vsys/entry/profiles.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profile_groups",
    "[READ-ONLY] Retrieves security profile groups that combine multiple security profiles. Reads config at: /config/.../vsys/entry/profile-group.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profile-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_pbf_rules",
    "[READ-ONLY] Retrieves policy-based forwarding (PBF) rules. Reads config at: /config/.../rulebase/pbf/rules.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/pbf/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dos_profiles",
    "[READ-ONLY] Retrieves DoS protection profiles. Reads config at: /config/.../profiles/dos-protection.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/dos-protection");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_qos_rules",
    "[READ-ONLY] Retrieves QoS policy rules. Reads config at: /config/.../rulebase/qos/rules.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/qos/rules");
      return formatResponse(result);
    }
  );
}
