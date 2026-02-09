import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

export function registerNetworkTools(server: McpServer) {
  server.tool(
    "get_interfaces",
    "[READ-ONLY] Retrieves all network interfaces with their status, IP addresses, and configuration. Executes: show interface all.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><interface>all</interface></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_zones",
    "[READ-ONLY] Retrieves all security zones configured on the firewall. Reads config at: /config/.../vsys/entry/zone.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/zone", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_routing_table",
    "[READ-ONLY] Retrieves the current routing table from the firewall. Executes: show routing route.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><routing><route></route></routing></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_arp_table",
    "[READ-ONLY] Retrieves ARP table entries from the firewall. Executes: show arp entry all.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><arp><entry>all</entry></arp></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_vlans",
    "[READ-ONLY] Retrieves VLAN configuration from the firewall. Reads config at: /config/.../network/vlan.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/vlan", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dhcp_leases",
    "[READ-ONLY] Retrieves DHCP server lease information. Executes: show dhcp server lease all.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await executeOpCommand("<show><dhcp><server><lease>all</lease></server></dhcp></show>", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "get_dns_proxy",
    "[READ-ONLY] Retrieves DNS proxy configuration. Reads config at: /config/.../network/dns-proxy.",
    {
      firewall: firewallName,
    },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/network/dns-proxy", target);
      return formatResponse(result);
    }
  );
}
