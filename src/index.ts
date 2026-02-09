#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadFirewallConfig, setCachedCredentialKey } from "./config/firewalls.js";
import { generateApiKey } from "./api/client.js";

import { registerFirewallTools } from "./tools/firewalls.js";
import { registerSystemTools } from "./tools/system.js";
import { registerNetworkTools } from "./tools/network.js";
import { registerSecurityTools } from "./tools/security.js";
import { registerObjectsTools } from "./tools/objects.js";
import { registerNatTools } from "./tools/nat.js";
import { registerUserIdTools } from "./tools/userid.js";
import { registerAdminTools } from "./tools/admin.js";
import { registerVpnTools } from "./tools/vpn.js";
import { registerPanoramaTools } from "./tools/panorama.js";
import { registerLogsTools } from "./tools/logs.js";
import { registerThreatTools } from "./tools/threat.js";
import { registerCertificatesTools } from "./tools/certificates.js";
import { registerLicensesTools } from "./tools/licenses.js";
import { registerConfigTools } from "./tools/config.js";
import { registerUtilityTools } from "./tools/utility.js";

loadFirewallConfig();

const server = new McpServer({
  name: "panos-mcp",
  version: "1.2.0",
});

// Register all tools
registerFirewallTools(server);
registerSystemTools(server);
registerNetworkTools(server);
registerSecurityTools(server);
registerObjectsTools(server);
registerNatTools(server);
registerUserIdTools(server);
registerAdminTools(server);
registerVpnTools(server);
registerPanoramaTools(server);
registerLogsTools(server);
registerThreatTools(server);
registerCertificatesTools(server);
registerLicensesTools(server);
registerConfigTools(server);
registerUtilityTools(server);

async function resolveCredentials(): Promise<void> {
  const apiKey = (process.env.PANOS_API_KEY ?? "").trim();
  const host = (process.env.PANOS_HOST ?? "").trim();
  const username = (process.env.PANOS_USERNAME ?? "").trim();
  const password = (process.env.PANOS_PASSWORD ?? "").trim();

  if (apiKey || !host) return;

  if (!username || !password) {
    if (username || password) {
      console.error("Credentials incomplete: both username and password are required");
    }
    return;
  }

  try {
    const result = await generateApiKey(host, username, password);
    if (result.success && result.data?.key) {
      setCachedCredentialKey(result.data.key);
      console.error(`API key generated from credentials for ${host}`);
    } else {
      console.error(`Failed to generate API key: ${result.error}`);
    }
  } catch (error) {
    console.error(`Failed to generate API key: ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function main() {
  await resolveCredentials();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
