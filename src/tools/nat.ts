import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getConfig, setConfig, formatResponse, resolveTarget, isApiError } from "../api/client.js";
import { firewallName } from "../schemas/panos.js";

function members(items: string[]): string {
  return items.map(i => `<member>${i}</member>`).join("");
}

export function registerNatTools(server: McpServer) {
  server.tool(
    "get_nat_rules",
    "[READ-ONLY] Retrieves all NAT policy rules including source NAT, destination NAT, and bidirectional rules. Reads config at: /config/.../rulebase/nat/rules.",
    {
      firewall: firewallName,
    },
    { readOnlyHint: true, destructiveHint: false },
    async ({ firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const result = await getConfig("/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/nat/rules", target);
      return formatResponse(result);
    }
  );

  server.tool(
    "add_nat_rule",
    "[MODIFIES CONFIG] Creates a new NAT policy rule (source NAT, destination NAT, or both). Staged in candidate config — requires 'commit' to activate.",
    {
      name: z.string().min(1).max(63).describe("NAT rule name"),
      from_zones: z.array(z.string().min(1)).min(1).describe("Source zones"),
      to_zones: z.array(z.string().min(1)).min(1).describe("Destination zones"),
      source: z.array(z.string().min(1)).min(1).describe("Source addresses or 'any'"),
      destination: z.array(z.string().min(1)).min(1).describe("Destination addresses or 'any'"),
      service: z.string().min(1).describe("Service (e.g. 'any', 'service-http')"),
      snat_type: z.enum(["dynamic-ip-and-port", "dynamic-ip", "static-ip"]).optional().describe("Source NAT type"),
      snat_address: z.string().optional().describe("Source NAT translated address (address object or IP)"),
      snat_interface: z.string().optional().describe("Source NAT interface (for dynamic-ip-and-port with interface)"),
      dnat_address: z.string().optional().describe("Destination NAT translated address"),
      dnat_port: z.string().optional().describe("Destination NAT translated port"),
      description: z.string().max(1023).optional().describe("Optional description"),
      disabled: z.boolean().optional().describe("Create rule in disabled state"),
      firewall: firewallName,
    },
    { readOnlyHint: false, destructiveHint: true },
    async ({ name, from_zones, to_zones, source, destination, service, snat_type, snat_address, snat_interface, dnat_address, dnat_port, description, disabled, firewall }) => {
      const target = resolveTarget(firewall);
      if (isApiError(target)) return formatResponse(target);
      const xpath = "/config/devices/entry[@name='localhost.localdomain']/vsys/entry[@name='vsys1']/rulebase/nat/rules";
      let element = `<entry name="${name}">`;
      element += `<from>${members(from_zones)}</from>`;
      element += `<to>${members(to_zones)}</to>`;
      element += `<source>${members(source)}</source>`;
      element += `<destination>${members(destination)}</destination>`;
      element += `<service>${service}</service>`;
      if (snat_type) {
        element += `<source-translation>`;
        if (snat_type === "dynamic-ip-and-port") {
          element += `<dynamic-ip-and-port>`;
          if (snat_interface) {
            element += `<interface-address><interface>${snat_interface}</interface></interface-address>`;
          } else if (snat_address) {
            element += `<translated-address>${members([snat_address])}</translated-address>`;
          }
          element += `</dynamic-ip-and-port>`;
        } else if (snat_type === "dynamic-ip") {
          element += `<dynamic-ip>`;
          if (snat_address) element += `<translated-address>${members([snat_address])}</translated-address>`;
          element += `</dynamic-ip>`;
        } else if (snat_type === "static-ip") {
          element += `<static-ip>`;
          if (snat_address) element += `<translated-address>${snat_address}</translated-address>`;
          element += `</static-ip>`;
        }
        element += `</source-translation>`;
      }
      if (dnat_address) {
        element += `<destination-translation><translated-address>${dnat_address}</translated-address>`;
        if (dnat_port) element += `<translated-port>${dnat_port}</translated-port>`;
        element += `</destination-translation>`;
      }
      if (description) element += `<description>${description}</description>`;
      if (disabled !== undefined) element += `<disabled>${disabled ? "yes" : "no"}</disabled>`;
      element += `</entry>`;
      const result = await setConfig(xpath, element, target);
      return formatResponse(result);
    }
  );
}
