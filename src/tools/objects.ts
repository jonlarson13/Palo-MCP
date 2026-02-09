import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerObjectsTools(server: McpServer) {
  server.tool(
    "get_address_objects",
    "[READ-ONLY] Retrieves all address objects (IP addresses, ranges, FQDNs) defined on the firewall. Reads config at: /config/.../vsys/entry/address.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_address_groups",
    "[READ-ONLY] Retrieves all address groups that contain multiple address objects. Reads config at: /config/.../vsys/entry/address-group.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_objects",
    "[READ-ONLY] Retrieves all service objects (port/protocol definitions) from the firewall. Reads config at: /config/.../vsys/entry/service.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_groups",
    "[READ-ONLY] Retrieves all service groups that contain multiple service objects. Reads config at: /config/.../vsys/entry/service-group.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_application_filters",
    "[READ-ONLY] Retrieves application filters used for application-based policy rules. Reads config at: /config/.../vsys/entry/application-filter.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/application-filter");
      return formatResponse(result);
    }
  );
}
