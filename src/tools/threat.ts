import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { executeOpCommand, getConfig, formatResponse } from "../api/client.js";

export function registerThreatTools(server: McpServer) {
  server.tool(
    "get_wildfire_status",
    "Get WildFire cloud connection status and statistics",
    {},
    async () => {
      const result = await executeOpCommand("<show><wildfire><status></status></wildfire></show>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_antivirus_version",
    "Get current antivirus signature version and release date",
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
    "Get available content update versions (antivirus, applications, threats)",
    {},
    async () => {
      const result = await executeOpCommand("<request><content><upgrade><info></info></upgrade></content></request>");
      return formatResponse(result);
    }
  );

  server.tool(
    "get_url_categories",
    "Get predefined URL filtering categories",
    {},
    async () => {
      const result = await getConfig("/config/predefined/pan-url-categories");
      return formatResponse(result);
    }
  );
}
