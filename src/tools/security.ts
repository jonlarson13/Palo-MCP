import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerSecurityTools(server: McpServer) {
  server.tool(
    "get_security_rules",
    "Get all security policy rules from the firewall",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/security/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profiles",
    "Get security profiles including antivirus, vulnerability, spyware, URL filtering profiles",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profile_groups",
    "Get security profile groups that combine multiple security profiles",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profile-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_pbf_rules",
    "Get policy-based forwarding rules",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/pbf/rules");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dos_profiles",
    "Get DoS protection profiles",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/dos-protection");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_qos_rules",
    "Get QoS policy rules",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/qos/rules");
      return formatResponse(result);
    }
  );
}
