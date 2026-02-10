import { XMLParser } from "fast-xml-parser";
import { Agent, fetch } from "undici";
import { resolveFirewall, isMultiFirewall } from "../config/firewalls.js";

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface FirewallTarget {
  host: string;
  apiKey: string;
}

export function resolveTarget(firewallParam?: string): FirewallTarget | ApiResponse {
  if (isMultiFirewall() && !firewallParam) {
    return {
      success: false,
      error: "Multiple firewalls configured. The 'firewall' parameter is required — use list_firewalls to see available names.",
    };
  }

  const entry = resolveFirewall(firewallParam);
  if (!entry) {
    if (firewallParam) {
      return {
        success: false,
        error: `Firewall '${firewallParam}' not found. Use list_firewalls to see available names.`,
      };
    }
    return {
      success: false,
      error: "No firewall configured. Set PANOS_HOST/PANOS_API_KEY environment variables or provide a firewalls.json config file.",
    };
  }

  return { host: entry.host, apiKey: entry.api_key };
}

export function isApiError(result: FirewallTarget | ApiResponse): result is ApiResponse {
  return "success" in result && !(result as any).host;
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

export async function generateApiKey(host: string, username: string, password: string): Promise<ApiResponse> {
  const url = `https://${host}/api/?type=keygen&user=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  try {
    const result = await makeRequest(url);
    if (result.success && result.data?.key) {
      return { success: true, data: { key: result.data.key } };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function executeOpCommand(cmd: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=op&cmd=${encodeURIComponent(cmd)}&key=${target.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function executeLogQuery(
  logType: string,
  nlogs: number,
  query: string | undefined,
  target: FirewallTarget
): Promise<ApiResponse> {
  // Step 1: Submit log query (type=log)
  let url = `https://${target.host}/api/?type=log&log-type=${encodeURIComponent(logType)}&nlogs=${nlogs}&key=${target.apiKey}`;
  if (query) {
    url += `&query=${encodeURIComponent(query)}`;
  }

  let submitResult: ApiResponse;
  try {
    submitResult = await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error submitting log query: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (!submitResult.success) return submitResult;

  const jobId = submitResult.data?.job;
  if (!jobId) {
    return { success: false, error: "No job ID returned from log query" };
  }

  // Step 2: Poll for results (type=log&action=get)
  const pollUrl = `https://${target.host}/api/?type=log&action=get&job-id=${jobId}&key=${target.apiKey}`;
  const maxAttempts = 30;
  const pollIntervalMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    let pollResult: ApiResponse;
    try {
      pollResult = await makeRequest(pollUrl);
    } catch (error) {
      return {
        success: false,
        error: `Error polling log results: ${error instanceof Error ? error.message : String(error)}`,
      };
    }

    if (!pollResult.success) return pollResult;

    const status = pollResult.data?.job?.status || pollResult.data?.log?.logs?.["@_progress"];
    if (status === "FIN" || pollResult.data?.log?.logs?.["@_progress"] === "100") {
      return { success: true, data: pollResult.data?.log?.logs };
    }
  }

  return { success: false, error: `Log query timed out after ${maxAttempts} seconds (job ${jobId})` };
}

export async function getConfig(xpath: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=config&action=get&xpath=${encodeURIComponent(xpath)}&key=${target.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function setConfig(xpath: string, element: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=config&action=set&xpath=${encodeURIComponent(xpath)}&element=${encodeURIComponent(element)}&key=${target.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function deleteConfig(xpath: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=config&action=delete&xpath=${encodeURIComponent(xpath)}&key=${target.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function commitConfig(cmd: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=commit&cmd=${encodeURIComponent(cmd)}&key=${target.apiKey}`;

  try {
    return await makeRequest(url);
  } catch (error) {
    return {
      success: false,
      error: `Error connecting to firewall: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

export async function commitAll(cmd: string, target?: FirewallTarget): Promise<ApiResponse> {
  if (!target) {
    const resolved = resolveTarget();
    if (isApiError(resolved)) return resolved;
    target = resolved;
  }

  const url = `https://${target.host}/api/?type=commit&action=all&cmd=${encodeURIComponent(cmd)}&key=${target.apiKey}`;

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
