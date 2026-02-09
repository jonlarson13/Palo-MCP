import { cpSync, rmSync } from "fs";
import { execSync } from "child_process";

// Copy manifest into the extension directory
cpSync("manifest.json", "extension/manifest.json");

// Create .mcpb zip from extension/ contents
execSync("cd extension && zip -r ../panos-mcp.mcpb manifest.json server/index.cjs");

// Clean up the extension directory
rmSync("extension", { recursive: true, force: true });

console.log("Packaged: panos-mcp.mcpb");
