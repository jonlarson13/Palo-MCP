import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerThreatTools(server: McpServer) {
  server.tool(
    "get_wildfire_status",
    "[READ-ONLY] Retrieves WildFire cloud connection status and statistics. Executes: show wildfire status.",
    {},
    async () => {
      const result = await executeOpCommand("<show><wildfire><status></status></wildfire></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_antivirus_version",
    "[READ-ONLY] Retrieves current antivirus, threat, and WildFire signature versions and release dates. Executes: show system info (extracts signature fields).",
    {},
    async () => {
      const result = await executeOpCommand("<show><system><info></info></system></show>");
      if (result.success && result.data?.system) {
        const system = result.data.system;
        result.data = {
          "av-version": system["av-version"],
          "av-release-date": system["av-release-date"],
          "threat-version": system["threat-version"],
          "threat-release-date": system["threat-release-date"],
          "wildfire-version": system["wildfire-version"],
          "wildfire-release-date": system["wildfire-release-date"],
        };
      }
      return formatResponse(result);
    }
  );

  server.tool(
    "get_content_versions",
    "[READ-ONLY] Retrieves available content update versions (antivirus, applications, threats). Executes: request content upgrade info.",
    {},
    async () => {
      const result = await executeOpCommand("<request><content><upgrade><info></info></upgrade></content></request>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_url_categories",
    "[READ-ONLY] Retrieves predefined URL filtering categories. Reads config at: /config/predefined/pan-url-categories.",
    {},
    async () => {
      const result = await getConfig("/config/predefined/pan-url-categories");
      return formatResponse(result);
    }
  );
}
