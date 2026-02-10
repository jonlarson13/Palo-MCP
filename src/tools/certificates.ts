import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getConfig, setConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

function members(items: string[]): string {
  return items.map(i => `<member>${i}</member>`).join("");
}

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

  server.tool(
    "add_decryption_rule",
    "[MODIFIES CONFIG] Creates a new SSL decryption policy rule. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Rule name"),
      from_zones: z.array(z.string().min(1)).min(1).describe("Source zones"),
      to_zones: z.array(z.string().min(1)).min(1).describe("Destination zones"),
      source: z.array(z.string().min(1)).min(1).describe("Source addresses or 'any'"),
      destination: z.array(z.string().min(1)).min(1).describe("Destination addresses or 'any'"),
      service: z.array(z.string().min(1)).min(1).describe("Services or 'any'"),
      action: z.enum(["decrypt", "no-decrypt"]).describe("Decrypt or pass through"),
      type: z.enum(["ssl-forward-proxy", "ssh-proxy", "ssl-inbound-inspection"]).optional().describe("Decryption type (required when action is 'decrypt')"),
      decryption_profile: z.string().optional().describe("Decryption profile name to apply"),
      description: z.string().max(1023).optional().describe("Optional description"),
      disabled: z.boolean().optional().describe("Create rule in disabled state"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, from_zones, to_zones, source, destination, service, action, type, decryption_profile, description, disabled, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/decryption/rules";
      let element = `<entry name="${name}">`;
      element += `<from>${members(from_zones)}</from>`;
      element += `<to>${members(to_zones)}</to>`;
      element += `<source>${members(source)}</source>`;
      element += `<destination>${members(destination)}</destination>`;
      element += `<service>${members(service)}</service>`;
      element += `<action>${action}</action>`;
      if (type) element += `<type><${type}/></${"type"}>`;
      if (decryption_profile) element += `<profile>${decryption_profile}</profile>`;
      if (description) element += `<description>${description}</description>`;
      if (disabled !== undefined) element += `<disabled>${disabled ? "yes" : "no"}</disabled>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );
}
