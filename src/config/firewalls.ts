import { z } from "zod";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { homedir } from "os";

export interface FirewallEntry {
  name: string;
  host: string;
  api_key: string;
}

const firewallEntrySchema = z.object({
  name: z.string().min(1).max(63),
  host: z.string().min(1),
  api_key: z.string().min(1),
});

const firewallConfigSchema = z.object({
  firewalls: z.array(firewallEntrySchema).min(1),
});

let entries: FirewallEntry[] = [];
let cachedCredentialKey: string | null = null;

const defaultConfigPath = join(homedir(), ".config", "panos-mcp", "firewalls.json");

export function getConfigPath(): string {
  return process.env.PANOS_FIREWALLS_CONFIG ?? defaultConfigPath;
}

export function loadFirewallConfig(): void {
  const configPath = getConfigPath();

  let raw: string;
  try {
    raw = readFileSync(configPath, "utf-8");
  } catch {
    // No config file — will fall back to env vars
    entries = [];
    return;
  }

  const parsed = firewallConfigSchema.parse(JSON.parse(raw));
  entries = parsed.firewalls;
}

export function resolveFirewall(name?: string): FirewallEntry | null {
  // Explicit name lookup
  if (name) {
    return entries.find((e) => e.name === name) ?? null;
  }

  // Single entry — use it as default
  if (entries.length === 1) {
    return entries[0];
  }

  // Multi-mode requires explicit name
  if (entries.length > 1) {
    return null;
  }

  // No config entries — fall back to env vars
  const host = (process.env.PANOS_HOST ?? "").trim();
  const api_key = (process.env.PANOS_API_KEY ?? "").trim();
  if (host && api_key) {
    return { name: "env", host, api_key };
  }

  // No API key — try auto-keygen from username/password (set by resolveCredentials)
  if (host && cachedCredentialKey) {
    return { name: "env", host, api_key: cachedCredentialKey };
  }

  return null;
}

export function isMultiFirewall(): boolean {
  return entries.length > 1;
}

export function getFirewallEntries(): FirewallEntry[] {
  return entries;
}

export function setCachedCredentialKey(key: string): void {
  cachedCredentialKey = key;
}

export function saveFirewallEntry(entry: FirewallEntry): void {
  const configPath = getConfigPath();
  mkdirSync(dirname(configPath), { recursive: true });

  let config: { firewalls: FirewallEntry[] };
  try {
    const raw = readFileSync(configPath, "utf-8");
    config = JSON.parse(raw);
    if (!Array.isArray(config.firewalls)) {
      config = { firewalls: [] };
    }
  } catch {
    config = { firewalls: [] };
  }

  const idx = config.firewalls.findIndex((e) => e.name === entry.name);
  if (idx >= 0) {
    config.firewalls[idx] = entry;
  } else {
    config.firewalls.push(entry);
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");

  // Reload in-memory entries so the server picks up changes immediately
  entries = config.firewalls;
}
