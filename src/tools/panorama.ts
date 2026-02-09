import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerPanoramaTools(server: McpServer) {
  // Managed Devices
  server.tool(
    "panorama_get_managed_devices",
    "Get all firewalls managed by Panorama with their connection status",
    {},
    async () => {
      const result = await executeOpCommand("<show><devices><all></all></devices></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_device_groups",
    "Get all device groups configured in Panorama",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/device-group");
      return formatResponse(result);
    }
  );

  // Templates
  server.tool(
    "panorama_get_templates",
    "Get all templates configured in Panorama",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/template");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_template_stacks",
    "Get all template stacks configured in Panorama",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/template-stack");
      return formatResponse(result);
    }
  );

  // Shared Objects (Panorama-level)
  server.tool(
    "panorama_get_shared_address_objects",
    "Get shared address objects defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/address");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_address_groups",
    "Get shared address groups defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/address-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_service_objects",
    "Get shared service objects defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/service");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_service_groups",
    "Get shared service groups defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/service-group");
      return formatResponse(result);
    }
  );

  // Pre/Post Rules (Panorama-pushed policies)
  server.tool(
    "panorama_get_pre_rules",
    "Get pre-rules from a device group (rules pushed before local firewall rules)",
    {
      device_group: z.string().describe("Name of the device group"),
    },
    async ({ device_group }) => {
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/pre-rulebase/security/rules`
      );
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_post_rules",
    "Get post-rules from a device group (rules pushed after local firewall rules)",
    {
      device_group: z.string().describe("Name of the device group"),
    },
    async ({ device_group }) => {
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/post-rulebase/security/rules`
      );
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_device_group_nat_rules",
    "Get NAT rules from a device group (pre and post rules)",
    {
      device_group: z.string().describe("Name of the device group"),
      rulebase: z.enum(["pre", "post"]).describe("Rulebase type: 'pre' or 'post'"),
    },
    async ({ device_group, rulebase }) => {
      const result = await getConfig(
        `/config/devices/entry[@name='localhost.localdomain']/device-group/entry[@name='${device_group}']/${rulebase}-rulebase/nat/rules`
      );
      return formatResponse(result);
    }
  );

  // Log Collectors
  server.tool(
    "panorama_get_log_collectors",
    "Get log collector configuration and status from Panorama",
    {},
    async () => {
      const result = await executeOpCommand("<show><log-collector><all></all></log-collector></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_collector_groups",
    "Get collector group configuration from Panorama",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/log-collector-group");
      return formatResponse(result);
    }
  );

  // Push Status
  server.tool(
    "panorama_get_push_status",
    "Get the status of the last configuration push to managed devices",
    {},
    async () => {
      const result = await executeOpCommand("<show><config><push><status></status></push></config></show>");
      return formatResponse(result);
    }
  );

  // Commit Status
  server.tool(
    "panorama_get_commit_status",
    "Get the status of pending commits in Panorama",
    {},
    async () => {
      const result = await executeOpCommand("<show><jobs><all></all></jobs></show>");
      return formatResponse(result);
    }
  );

  // Software/Content Versions on Managed Devices
  server.tool(
    "panorama_get_managed_device_software",
    "Get software and content versions on all managed firewalls",
    {},
    async () => {
      const result = await executeOpCommand("<show><devices><all></all></devices></show>");
      return formatResponse(result);
    }
  );

  // Panorama HA
  server.tool(
    "panorama_get_ha_status",
    "Get Panorama high-availability status (for Panorama HA pairs)",
    {},
    async () => {
      const result = await executeOpCommand("<show><high-availability><state></state></high-availability></show>");
      return formatResponse(result);
    }
  );

  // Device Group Hierarchy
  server.tool(
    "panorama_get_device_group_hierarchy",
    "Get the device group hierarchy showing parent-child relationships",
    {},
    async () => {
      const result = await getConfig("/config/readonly/devices/entry[@name='localhost.localdomain']/device-group");
      return formatResponse(result);
    }
  );

  // Shared Security Profiles
  server.tool(
    "panorama_get_shared_security_profiles",
    "Get shared security profiles defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/profiles");
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_get_shared_profile_groups",
    "Get shared security profile groups defined at Panorama level",
    {},
    async () => {
      const result = await getConfig("/config/shared/profile-group");
      return formatResponse(result);
    }
  );
}
