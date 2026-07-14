import { TOOLS } from "../packages/tools-registry/src/index";
import fs from "node:fs";

const seen = new Set<string>();
const errors: string[] = [];

for (const tool of TOOLS) {
  if (seen.has(tool.slug)) {
    errors.push(`Duplicate slug: ${tool.slug}`);
  }
  seen.add(tool.slug);

  if (!tool.componentPath) {
    errors.push(`Missing componentPath for ${tool.slug}`);
  }

  if (!tool.componentPath?.includes("@/components/")) {
    errors.push(`Component path missing app alias for ${tool.slug}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const registryPath = "packages/tools-registry/src/index.ts";
if (!fs.existsSync(registryPath)) {
  errors.push(`Registry file missing: ${registryPath}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Registry validated: ${TOOLS.length} tools`);
