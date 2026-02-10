import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getConfig, setConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

function members(items: string[]): string {
  return items.map(i => `<member>${i}</member>`).join("");
}

export function registerSecurityTools(server: McpServer) {
  server.tool(
    "get_security_rules",
    "[READ-ONLY] Retrieves all security policy rules from the firewall. Reads config at: /config/.../rulebase/security/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/security/rules", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profiles",
    "[READ-ONLY] Retrieves security profiles including antivirus, vulnerability, spyware, and URL filtering profiles. Reads config at: /config/.../vsys/entry/profiles.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_security_profile_groups",
    "[READ-ONLY] Retrieves security profile groups that combine multiple security profiles. Reads config at: /config/.../vsys/entry/profile-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profile-group", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_pbf_rules",
    "[READ-ONLY] Retrieves policy-based forwarding (PBF) rules. Reads config at: /config/.../rulebase/pbf/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/pbf/rules", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dos_profiles",
    "[READ-ONLY] Retrieves DoS protection profiles. Reads config at: /config/.../profiles/dos-protection.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/profiles/dos-protection", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_qos_rules",
    "[READ-ONLY] Retrieves QoS policy rules. Reads config at: /config/.../rulebase/qos/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/qos/rules", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_security_rule",
    "[MODIFIES CONFIG] Creates a new security policy rule. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Rule name"),
      from_zones: z.array(z.string().min(1)).min(1).describe("Source zones (e.g. ['trust', 'dmz'])"),
      to_zones: z.array(z.string().min(1)).min(1).describe("Destination zones (e.g. ['untrust'])"),
      source: z.array(z.string().min(1)).min(1).describe("Source addresses or 'any'"),
      destination: z.array(z.string().min(1)).min(1).describe("Destination addresses or 'any'"),
      application: z.array(z.string().min(1)).min(1).describe("Applications (e.g. ['web-browsing', 'ssl']) or 'any'"),
      service: z.array(z.string().min(1)).min(1).describe("Services (e.g. ['application-default', 'service-http']) or 'any'"),
      action: z.enum(["allow", "deny", "drop", "reset-client", "reset-server", "reset-both"]).describe("Rule action"),
      log_end: z.boolean().optional().describe("Log at session end (default: true in PanOS)"),
      log_start: z.boolean().optional().describe("Log at session start"),
      profile_group: z.string().optional().describe("Security profile group name to apply"),
      description: z.string().max(1023).optional().describe("Optional description"),
      disabled: z.boolean().optional().describe("Create rule in disabled state"),
      tag: z.array(z.string().min(1)).optional().describe("Tags to apply to the rule"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, from_zones, to_zones, source, destination, application, service, action, log_end, log_start, profile_group, description, disabled, tag, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/security/rules";
      let element = `<entry name="${name}">`;
      element += `<from>${members(from_zones)}</from>`;
      element += `<to>${members(to_zones)}</to>`;
      element += `<source>${members(source)}</source>`;
      element += `<destination>${members(destination)}</destination>`;
      element += `<application>${members(application)}</application>`;
      element += `<service>${members(service)}</service>`;
      element += `<action>${action}</action>`;
      if (log_end !== undefined) element += `<log-end>${log_end ? "yes" : "no"}</log-end>`;
      if (log_start !== undefined) element += `<log-start>${log_start ? "yes" : "no"}</log-start>`;
      if (profile_group) element += `<profile-setting><group><member>${profile_group}</member></group></profile-setting>`;
      if (description) element += `<description>${description}</description>`;
      if (disabled !== undefined) element += `<disabled>${disabled ? "yes" : "no"}</disabled>`;
      if (tag && tag.length > 0) element += `<tag>${members(tag)}</tag>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );
}
