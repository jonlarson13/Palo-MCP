import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getConfig, setConfig, deleteConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

function members(items: string[]): string {
  return items.map(i => `<member>${i}</member>`).join("");
}

export function registerObjectsTools(server: McpServer) {
  server.tool(
    "get_address_objects",
    "[READ-ONLY] Retrieves all address objects (IP addresses, ranges, FQDNs) defined on the firewall. Reads config at: /config/.../vsys/entry/address.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
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
    { readOnlyHint: true, destructiveHint: false },
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
    { readOnlyHint: true, destructiveHint: false },
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
    { readOnlyHint: true, destructiveHint: false },
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
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/application-filter", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_address_object",
    "[MODIFIES CONFIG] Creates an address object (IP/netmask, IP range, or FQDN). Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Address object name"),
      type: z.enum(["ip-netmask", "ip-range", "fqdn"]).describe("Address type"),
      value: z.string().min(1).describe("Address value (e.g. '10.0.0.0/24', '10.0.0.1-10.0.0.10', 'example.com')"),
      description: z.string().max(1023).optional().describe("Optional description"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, type, value, description, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address";
      let element = `<entry name="${name}"><${type}>${value}</${type}>`;
      if (description) element += `<description>${description}</description>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_address_group",
    "[MODIFIES CONFIG] Creates a static address group containing one or more address objects. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Address group name"),
      members: z.array(z.string().min(1)).min(1).describe("List of address object names to include"),
      description: z.string().max(1023).optional().describe("Optional description"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, members: memberList, description, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address-group";
      let element = `<entry name="${name}"><static>${members(memberList)}</static>`;
      if (description) element += `<description>${description}</description>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_service_object",
    "[MODIFIES CONFIG] Creates a TCP or UDP service object with a port or port range. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Service object name"),
      protocol: z.enum(["tcp", "udp"]).describe("Protocol"),
      port: z.string().min(1).describe("Port number or range (e.g. '443', '8000-8080')"),
      description: z.string().max(1023).optional().describe("Optional description"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, protocol, port, description, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service";
      let element = `<entry name="${name}"><protocol><${protocol}><port>${port}</port></${protocol}></protocol>`;
      if (description) element += `<description>${description}</description>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_service_group",
    "[MODIFIES CONFIG] Creates a service group containing one or more service objects. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Service group name"),
      members: z.array(z.string().min(1)).min(1).describe("List of service object names to include"),
      description: z.string().max(1023).optional().describe("Optional description"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, members: memberList, description, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service-group";
      let element = `<entry name="${name}"><members>${members(memberList)}</members>`;
      if (description) element += `<description>${description}</description>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_address_object",
    "[MODIFIES CONFIG] Deletes an address object. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Address object name to delete"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address/entry[@name='${name}']`;
      const result = await deleteConfig(xpath, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_address_group",
    "[MODIFIES CONFIG] Deletes an address group. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Address group name to delete"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address-group/entry[@name='${name}']`;
      const result = await deleteConfig(xpath, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_service_object",
    "[MODIFIES CONFIG] Deletes a service object. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Service object name to delete"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service/entry[@name='${name}']`;
      const result = await deleteConfig(xpath, target);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_service_group",
    "[MODIFIES CONFIG] Deletes a service group. Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("Service group name to delete"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = `/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service-group/entry[@name='${name}']`;
      const result = await deleteConfig(xpath, target);
      return formatResponse(result);
    }
  );
}
