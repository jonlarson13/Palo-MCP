import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeOpCommand, getConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { deviceGroup, firewallName } from "../schemas/panos.js";

export function registerPanoramaTools(server: McpServer) {
  // Managed Devices
  server.tool(
    "panorama_get_managed_devices",
    "[READ-ONLY] Retrieves all firewalls managed by Panorama with their connection status. Executes: show devices all.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><devices><all></all></devices></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_device_groups",
    "[READ-ONLY] Retrieves all device groups configured in Panorama. Reads config at: /config/.../device-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/device-group", target);
      return formatResponse(result);
    }
  );

  // Templates
  server.tool(
    "panorama_get_templates",
    "[READ-ONLY] Retrieves all templates configured in Panorama. Reads config at: /config/.../template.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/template", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_template_stacks",
    "[READ-ONLY] Retrieves all template stacks configured in Panorama. Reads config at: /config/.../template-stack.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/template-stack", target);
      return formatResponse(result);
    }
  );

  // Shared Objects (Panorama-level)
  server.tool(
    "panorama_get_shared_address_objects",
    "[READ-ONLY] Retrieves shared address objects defined at Panorama level. Reads config at: /config/shared/address.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/address", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_address_groups",
    "[READ-ONLY] Retrieves shared address groups defined at Panorama level. Reads config at: /config/shared/address-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/address-group", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_service_objects",
    "[READ-ONLY] Retrieves shared service objects defined at Panorama level. Reads config at: /config/shared/service.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/service", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_service_groups",
    "[READ-ONLY] Retrieves shared service groups defined at Panorama level. Reads config at: /config/shared/service-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/service-group", target);
      return formatResponse(result);
    }
  );

  // Pre/Post Rules (Panorama-pushed policies)
  server.tool(
    "panorama_get_pre_rules",
    "[READ-ONLY] Retrieves pre-rules from a device group (rules pushed before local firewall rules). Reads config at: /config/.../device-group/entry/pre-rulebase/security/rules.",
    {
      device_group: deviceGroup,
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ device_group, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/pre-rulebase/security/rules`,
        target
      );
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_post_rules",
    "[READ-ONLY] Retrieves post-rules from a device group (rules pushed after local firewall rules). Reads config at: /config/.../device-group/entry/post-rulebase/security/rules.",
    {
      device_group: deviceGroup,
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ device_group, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/post-rulebase/security/rules`,
        target
      );
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_device_group_nat_rules",
    "[READ-ONLY] Retrieves NAT rules from a device group (pre or post rulebase). Reads config at: /config/.../device-group/entry/{pre|post}-rulebase/nat/rules.",
    {
      device_group: deviceGroup,
      rulebase: z.enum(["pre", "post"]).describe("Rulebase type: 'pre' or 'post'"),
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ device_group, rulebase, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/${rulebase}-rulebase/nat/rules`,
        target
      );
      return formatResponse(result);
    }
  );

  // Log Collectors
  server.tool(
    "panorama_get_log_collectors",
    "[READ-ONLY] Retrieves log collector configuration and status from Panorama. Executes: show log-collector all.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><log-collector><all></all></log-collector></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_collector_groups",
    "[READ-ONLY] Retrieves collector group configuration from Panorama. Reads config at: /config/.../log-collector-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/log-collector-group", target);
      return formatResponse(result);
    }
  );

  // Push Status
  server.tool(
    "panorama_get_push_status",
    "[READ-ONLY] Retrieves the status of the last configuration push to managed devices. Executes: show config push status.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><config><push><status></status></push></config></show>", target);
      return formatResponse(result);
    }
  );

  // Commit Status
  server.tool(
    "panorama_get_commit_status",
    "[READ-ONLY] Retrieves the status of pending commits in Panorama. Executes: show jobs all.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><jobs><all></all></jobs></show>", target);
      return formatResponse(result);
    }
  );

  // Software/Content Versions on Managed Devices
  server.tool(
    "panorama_get_managed_device_software",
    "[READ-ONLY] Retrieves software and content versions on all managed firewalls. Executes: show devices all.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><devices><all></all></devices></show>", target);
      return formatResponse(result);
    }
  );

  // Panorama HA
  server.tool(
    "panorama_get_ha_status",
    "[READ-ONLY] Retrieves Panorama high-availability status for Panorama HA pairs. Executes: show high-availability state.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><high-availability><state></state></high-availability></show>", target);
      return formatResponse(result);
    }
  );

  // Device Group Hierarchy
  server.tool(
    "panorama_get_device_group_hierarchy",
    "[READ-ONLY] Retrieves the device group hierarchy showing parent-child relationships. Reads config at: /config/readonly/.../device-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/readonly/devices/entry[@name='localhost.localdomain']/device-group", target);
      return formatResponse(result);
    }
  );

  // Shared Security Profiles
  server.tool(
    "panorama_get_shared_security_profiles",
    "[READ-ONLY] Retrieves shared security profiles defined at Panorama level. Reads config at: /config/shared/profiles.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/profiles", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_profile_groups",
    "[READ-ONLY] Retrieves shared security profile groups defined at Panorama level. Reads config at: /config/shared/profile-group.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/shared/profile-group", target);
      return formatResponse(result);
    }
  );
}
