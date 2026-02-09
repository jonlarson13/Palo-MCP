import { XMLParser } from "fast-xml-parser";
import { Agent, fetch } from "undici";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

function getCredentials(): { host: string; apiKey: string } | null {
  const host = process.env.PANOS_HOST;
  const apiKey = process.env.PANOS_API_KEY;

  if (!host || !apiKey) {
    return null;
  }

  return { host, apiKey };
}

async function makeRequest(url: string): Promise<ApiResponse> {
  const agent = new Agent({
    connect: { rejectUnauthorized: false },
  });

  const response = await fetch(url, {
    method: "GET",
    dispatcher: agent,
  });

  if (!response.ok) {
    return {
      success: false,
      error: `HTTP ${response.status} ${response.statusText}`,
    };
  }

  const xmlText = await response.text();
  const parsed = xmlParser.parse(xmlText);

  if (parsed.response?.["@_status"] === "error") {
    return {
      success: false,
      error: `PanOS API Error: ${JSON.stringify(parsed.response.msg || parsed.response)}`,
    };
  }

  return {
    success: true,
    data: parsed.response?.result,
  };
}

export async function executeOpCommand(cmd: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=op&cmd=${encodeURIComponent(cmd)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function getConfig(xpath: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=config&action=get&xpath=${encodeURIComponent(xpath)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function setConfig(xpath: string, element: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=config&action=set&xpath=${encodeURIComponent(xpath)}&element=${encodeURIComponent(element)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function deleteConfig(xpath: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=config&action=delete&xpath=${encodeURIComponent(xpath)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function commitConfig(cmd: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=commit&cmd=${encodeURIComponent(cmd)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function commitAll(cmd: string): Promise<ApiResponse> {
  const creds = getCredentials();
  if (!creds) {
    return {
      success: false,
      error: "PANOS_HOST and PANOS_API_KEY environment variables must be set",
    };
  }

  const url = `https://${creds.host}/api/?type=commit&action=all&cmd=${encodeURIComponent(cmd)}&key=${creds.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export function formatResponse(result: ApiResponse): { content: Array<{ type: "text"; text: string }> } {
  if (!result.success) {
    return {
      content: [{ type: "text", text: `Error: ${result.error}` }],
    };
  }

  return {
    content: [{ type: "text", text: JSON.stringify(result.data, null, 2) }],
  };
}
