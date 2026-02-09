import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

export function registerObjectsTools(server: McpServer) {
  server.tool(
    "get_address_objects",
    "[READ-ONLY] Retrieves all address objects (IP addresses, ranges, FQDNs) defined on the firewall. Reads config at: /config/.../vsys/entry/address.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_address_groups",
    "[READ-ONLY] Retrieves all address groups that contain multiple address objects. Reads config at: /config/.../vsys/entry/address-group.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address-group", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_objects",
    "[READ-ONLY] Retrieves all service objects (port/protocol definitions) from the firewall. Reads config at: /config/.../vsys/entry/service.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_groups",
    "[READ-ONLY] Retrieves all service groups that contain multiple service objects. Reads config at: /config/.../vsys/entry/service-group.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service-group", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_application_filters",
    "[READ-ONLY] Retrieves application filters used for application-based policy rules. Reads config at: /config/.../vsys/entry/application-filter.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/application-filter", target);
      return formatResponse(result);
    }
  );
}
