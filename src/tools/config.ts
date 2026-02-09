import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { setConfig, deleteConfig, commitConfig, commitAll, formatResponse } from "../api/client.js";
import { configXpath, deviceGroup, xmlElement, commitDescription, partialAdmin } from "../schemas/panos.js";

export function registerConfigTools(server: McpServer) {
  server.tool(
    "set_config",
    "[MODIFIES CONFIG] Sets or creates configuration at a specific XPath location on the firewall. Changes are staged in the candidate config and require a separate 'commit' to take effect on the running firewall.",
    {
      xpath: configXpath.describe("XPath to the configuration location (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/vsys/entry[@name=\"vsys1\"]/address')"),
      element: xmlElement.describe("XML element to set at the xpath location (e.g., '<entry name=\"test-addr\"><ip-netmask>10.0.0.1/32</ip-netmask></entry>')"),
    },
    async ({ xpath, element }) => {
      const result = await setConfig(xpath, element);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_config",
    "[MODIFIES CONFIG] Deletes configuration at a specific XPath location on the firewall. Changes are staged in the candidate config and require a separate 'commit' to take effect.",
    {
      xpath: configXpath.describe("XPath to the configuration element to delete (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/vsys/entry[@name=\"vsys1\"]/address/entry[@name=\"test-addr\"]')"),
    },
    async ({ xpath }) => {
      const result = await deleteConfig(xpath);
      return formatResponse(result);
    }
  );

  server.tool(
    "commit",
    "[MODIFIES CONFIG] Commits all pending (staged) configuration changes to the running firewall. This activates changes made by set_config/delete_config. This action affects live traffic.",
    {
      description: commitDescription.describe("Optional commit description/comment"),
      partial_admin: partialAdmin.describe("Commit only changes made by this admin user"),
    },
    async ({ description, partial_admin }) => {
      let cmd = "<commit>";
      if (description) {
        cmd += `<description>${description}</description>`;
      }
      if (partial_admin) {
        cmd += `<partial><admin><member>${partial_admin}</member></admin></partial>`;
      }
      cmd += "</commit>";
      const result = await commitConfig(cmd);
      return formatResponse(result);
    }
  );

  server.tool(
    "panorama_push_to_devices",
    "[MODIFIES CONFIG] Pushes configuration from Panorama to managed firewall devices. This deploys policy and object changes to production firewalls in the specified device group. This action affects live traffic on managed devices.",
    {
      device_group: deviceGroup.describe("Device group name to push to"),
      description: commitDescription.describe("Optional push description"),
      include_template: z.boolean().optional().describe("Include template stack (default: false)"),
    },
    async ({ device_group, description, include_template }) => {
      let cmd = "<commit-all><shared-policy>";
      cmd += `<device-group><entry name="${device_group}"/></device-group>`;
      if (description) {
        cmd += `<description>${description}</description>`;
      }
      if (include_template) {
        cmd += "<include-template>yes</include-template>";
      }
      cmd += "</shared-policy></commit-all>";
      const result = await commitAll(cmd);
      return formatResponse(result);
    }
  );
}
