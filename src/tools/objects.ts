import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getConfig, formatResponse } from "../api/client.js";

export function registerObjectsTools(server: McpServer) {
  server.tool(
    "get_address_objects",
    "Get all address objects (IP addresses, ranges, FQDNs) defined on the firewall",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_address_groups",
    "Get all address groups that contain multiple address objects",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/address-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_objects",
    "Get all service objects (port/protocol definitions) from the firewall",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_service_groups",
    "Get all service groups that contain multiple service objects",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/service-group");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_application_filters",
    "Get application filters used for application-based policy rules",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/application-filter");
      return formatResponse(result);
    }
  );
}
