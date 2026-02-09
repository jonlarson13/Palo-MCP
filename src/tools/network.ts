import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerNetworkTools(server: McpServer) {
  server.tool(
    "get_interfaces",
    "[READ-ONLY] Retrieves all network interfaces with their status, IP addresses, and configuration. Executes: show interface all.",
    {},
    async () => {
      const result = await executeOpCommand("<show><interface>all</interface></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_zones",
    "[READ-ONLY] Retrieves all security zones configured on the firewall. Reads config at: /config/.../vsys/entry/zone.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/zone");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_routing_table",
    "[READ-ONLY] Retrieves the current routing table from the firewall. Executes: show routing route.",
    {},
    async () => {
      const result = await executeOpCommand("<show><routing><route></route></routing></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_arp_table",
    "[READ-ONLY] Retrieves ARP table entries from the firewall. Executes: show arp entry all.",
    {},
    async () => {
      const result = await executeOpCommand("<show><arp><entry>all</entry></arp></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_vlans",
    "[READ-ONLY] Retrieves VLAN configuration from the firewall. Reads config at: /config/.../network/vlan.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/vlan");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dhcp_leases",
    "[READ-ONLY] Retrieves DHCP server lease information. Executes: show dhcp server lease all.",
    {},
    async () => {
      const result = await executeOpCommand("<show><dhcp><server><lease>all</lease></server></dhcp></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dns_proxy",
    "[READ-ONLY] Retrieves DNS proxy configuration. Reads config at: /config/.../network/dns-proxy.",
    {},
    async () => {
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/dns-proxy");
      return formatResponse(result);
    }
  );
}
