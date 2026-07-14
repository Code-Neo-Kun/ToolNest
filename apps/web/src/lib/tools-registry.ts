export * from "@neotools/tools-registry";
import { TOOLS, type ToolDefinition } from "@neotools/tools-registry";

export function getPopularTools(): Array<ToolDefinition> {
  return TOOLS.filter((tool) => tool.isPopular);
}

export function getNewTools(): Array<ToolDefinition> {
  return TOOLS.filter((tool) => tool.isNew);
}
