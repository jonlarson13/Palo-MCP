import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerNetworkTools(server: McpServer) {
  server.tool(
    "get_interfaces",
    "Get all network interfaces with their status, IP addresses, and configuration",
    {},
    async () => {
      const result = await executeOpCommand("<show><interface>all</interface></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_zones",
    "Get all security zones configured on the firewall",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/zone");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_routing_table",
    "Get the current routing table from the firewall",
    {},
    async () => {
      const result = await executeOpCommand("<show><routing><route></route></routing></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_arp_table",
    "Get the ARP table entries from the firewall",
    {},
    async () => {
      const result = await executeOpCommand("<show><arp><entry>all</entry></arp></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_vlans",
    "Get VLAN configuration from the firewall",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/vlan");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dhcp_leases",
    "Get DHCP server lease information",
    {},
    async () => {
      const result = await executeOpCommand("<show><dhcp><server><lease>all</lease></server></dhcp></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dns_proxy",
    "Get DNS proxy configuration",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/dns-proxy");
      return formatResponse(result);
    }
  );
}
