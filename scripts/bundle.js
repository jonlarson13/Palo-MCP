import { build } from "esbuild";

await build({
  entryPoints: ["dist/index.js"],
  outfile: "extension/server/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  banner: { js: "#!/usr/bin/env node" },
  external: [],
});

console.log("Bundle created: extension/server/index.js");
