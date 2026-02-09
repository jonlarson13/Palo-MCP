import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getFirewallEntries, isMultiFirewall, saveFirewallEntry } from "../config/firewalls.js";
import { generateApiKey, formatResponse } from "../api/client.js";
import { firewallHost, username, password, saveName } from "../schemas/panos.js";

export function registerFirewallTools(server: McpServer) {
  server.tool(
    "list_firewalls",
    "[READ-ONLY] Lists all configured firewall targets. Shows names and hosts (never API keys). Indicates whether the 'firewall' parameter is required for other tools.",
    {},
    async () => {
      const entries = getFirewallEntries();
      const multi = isMultiFirewall();

      let mode: string;
      if (entries.length === 0) {
        mode = "environment";
      } else if (entries.length === 1) {
        mode = "single";
      } else {
        mode = "multi";
      }

      const firewalls = entries.map((e) => ({ name: e.name, host: e.host }));

      const data = {
        mode,
        firewall_param_required: multi,
        firewalls,
      };

      if (entries.length === 0) {
        const host = process.env.PANOS_HOST;
        if (host) {
          data.firewalls = [{ name: "env", host }];
        }
      }

      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "generate_api_key",
    "Generates a PanOS API key using username/password credentials. Optionally saves the firewall entry to firewalls.json for future use.",
    {
      host: firewallHost,
      username,
      password,
      save_name: saveName,
    },
    async (params) => {
      const result = await generateApiKey(params.host, params.username, params.password);

      if (!result.success) {
        return formatResponse(result);
      }

      const key = result.data.key;

      if (params.save_name) {
        try {
          saveFirewallEntry({ name: params.save_name, host: params.host, api_key: key });
        } catch (error) {
          return {
            content: [{
              type: "text" as const,
              text: `API key generated successfully: ${key}\n\nWarning: Failed to save to firewalls.json: ${error instanceof Error ? error.message : String(error)}`,
            }],
          };
        }
      }

      const message = params.save_name
        ? `API key generated and saved as "${params.save_name}" in firewalls.json.\n\nKey: ${key}`
        : `API key: ${key}`;

      return {
        content: [{ type: "text" as const, text: message }],
      };
    }
  );
}
