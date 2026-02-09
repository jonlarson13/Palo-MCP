import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { resolve } from "path";
import { loadFirewallConfig, resolveFirewall, isMultiFirewall, getFirewallEntries, saveFirewallEntry } from "../../src/config/firewalls.js";

const tmpConfig = resolve("firewalls.test.tmp.json");

function writeConfig(data: any) {
  writeFileSync(tmpConfig, JSON.stringify(data));
}

function cleanup() {
  try { unlinkSync(tmpConfig); } catch {}
}

describe("firewalls config", () => {
  beforeEach(() => {
    cleanup();
    delete process.env.PANOS_FIREWALLS_CONFIG;
    delete process.env.PANOS_HOST;
    delete process.env.PANOS_API_KEY;
  });

  describe("no config file — env var fallback", () => {
    beforeEach(() => {
      // Point to a non-existent file so loadFirewallConfig() finds nothing
      process.env.PANOS_FIREWALLS_CONFIG = tmpConfig;
      loadFirewallConfig();
    });

    it("resolves to null when no env vars set", () => {
      expect(resolveFirewall()).toBeNull();
    });

    it("resolves to env entry when env vars are set", () => {
      process.env.PANOS_HOST = "10.0.0.1";
      process.env.PANOS_API_KEY = "key123";
      const entry = resolveFirewall();
      expect(entry).toEqual({ name: "env", host: "10.0.0.1", api_key: "key123" });
    });

    it("isMultiFirewall returns false", () => {
      expect(isMultiFirewall()).toBe(false);
    });

    it("getFirewallEntries returns empty array", () => {
      expect(getFirewallEntries()).toEqual([]);
    });
  });

  describe("single entry config", () => {
    beforeEach(() => {
      process.env.PANOS_FIREWALLS_CONFIG = tmpConfig;
      writeConfig({
        firewalls: [{ name: "fw1", host: "10.0.1.1", api_key: "key1" }],
      });
      loadFirewallConfig();
    });

    it("resolves without name (default to single entry)", () => {
      expect(resolveFirewall()).toEqual({ name: "fw1", host: "10.0.1.1", api_key: "key1" });
    });

    it("resolves by name", () => {
      expect(resolveFirewall("fw1")).toEqual({ name: "fw1", host: "10.0.1.1", api_key: "key1" });
    });

    it("returns null for unknown name", () => {
      expect(resolveFirewall("unknown")).toBeNull();
    });

    it("isMultiFirewall returns false", () => {
      expect(isMultiFirewall()).toBe(false);
    });
  });

  describe("multi entry config", () => {
    beforeEach(() => {
      process.env.PANOS_FIREWALLS_CONFIG = tmpConfig;
      writeConfig({
        firewalls: [
          { name: "fw1", host: "10.0.1.1", api_key: "key1" },
          { name: "fw2", host: "10.0.2.2", api_key: "key2" },
        ],
      });
      loadFirewallConfig();
    });

    it("returns null without name (multi requires explicit)", () => {
      expect(resolveFirewall()).toBeNull();
    });

    it("resolves by name", () => {
      expect(resolveFirewall("fw2")).toEqual({ name: "fw2", host: "10.0.2.2", api_key: "key2" });
    });

    it("returns null for unknown name", () => {
      expect(resolveFirewall("fw3")).toBeNull();
    });

    it("isMultiFirewall returns true", () => {
      expect(isMultiFirewall()).toBe(true);
    });

    it("getFirewallEntries returns all entries", () => {
      expect(getFirewallEntries()).toHaveLength(2);
    });
  });

  describe("saveFirewallEntry", () => {
    beforeEach(() => {
      process.env.PANOS_FIREWALLS_CONFIG = tmpConfig;
      cleanup();
    });

    it("creates firewalls.json when it does not exist", () => {
      saveFirewallEntry({ name: "new-fw", host: "10.0.3.1", api_key: "key3" });
      const data = JSON.parse(readFileSync(tmpConfig, "utf-8"));
      expect(data.firewalls).toHaveLength(1);
      expect(data.firewalls[0]).toEqual({ name: "new-fw", host: "10.0.3.1", api_key: "key3" });
    });

    it("appends to existing firewalls.json", () => {
      writeConfig({
        firewalls: [{ name: "fw1", host: "10.0.1.1", api_key: "key1" }],
      });
      saveFirewallEntry({ name: "fw2", host: "10.0.2.2", api_key: "key2" });
      const data = JSON.parse(readFileSync(tmpConfig, "utf-8"));
      expect(data.firewalls).toHaveLength(2);
      expect(data.firewalls[1].name).toBe("fw2");
    });

    it("updates existing entry by name", () => {
      writeConfig({
        firewalls: [{ name: "fw1", host: "10.0.1.1", api_key: "old-key" }],
      });
      saveFirewallEntry({ name: "fw1", host: "10.0.1.1", api_key: "new-key" });
      const data = JSON.parse(readFileSync(tmpConfig, "utf-8"));
      expect(data.firewalls).toHaveLength(1);
      expect(data.firewalls[0].api_key).toBe("new-key");
    });

    it("updates in-memory entries after save", () => {
      loadFirewallConfig(); // starts empty
      expect(getFirewallEntries()).toHaveLength(0);
      saveFirewallEntry({ name: "fw1", host: "10.0.1.1", api_key: "key1" });
      expect(getFirewallEntries()).toHaveLength(1);
      expect(getFirewallEntries()[0].name).toBe("fw1");
    });
  });
});
