import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { setConfig, deleteConfig, commitConfig, commitAll, formatResponse } from "../api/client.js";

export function registerConfigTools(server: McpServer) {
  server.tool(
    "set_config",
    "Set configuration at a specific XPath location (creates or updates). Changes are staged until committed.",
    {
      xpath: z.string().describe("XPath to the configuration location (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/vsys/entry[@name=\"vsys1\"]/address')"),
      element: z.string().describe("XML element to set at the xpath location (e.g., '<entry name=\"test-addr\"><ip-netmask>10.0.0.1/32</ip-netmask></entry>')"),
    },
    async ({ xpath, element }) => {
      const result = await setConfig(xpath, element);
      return formatResponse(result);
    }
  );

  server.tool(
    "delete_config",
    "Delete configuration at a specific XPath location. Changes are staged until committed.",
    {
      xpath: z.string().describe("XPath to the configuration element to delete (e.g., '/config/devices/entry[@name=\"localhost.localdomain\"]/vsys/entry[@name=\"vsys1\"]/address/entry[@name=\"test-addr\"]')"),
    },
    async ({ xpath }) => {
      const result = await deleteConfig(xpath);
      return formatResponse(result);
    }
  );

  server.tool(
    "commit",
    "Commit pending configuration changes to the firewall",
    {
      description: z.string().optional().describe("Optional commit description/comment"),
      partial_admin: z.string().optional().describe("Commit only changes made by this admin user"),
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
    "Push configuration from Panorama to managed devices (Panorama only)",
    {
      device_group: z.string().describe("Device group name to push to"),
      description: z.string().optional().describe("Optional push description"),
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
