export type ToolCategory =
  | "image"
  | "text"
  | "developer"
  | "seo"
  | "utility"
  | "finance"
  | "pdf";

export type ToolPattern =
  | "calculator"
  | "transform"
  | "file"
  | "generator"
  | "markup"
  | "content"
  | "analysis"
  | "reference";

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  pattern: ToolPattern;
  isFunctional: boolean;
  requiresAuth: boolean;
  componentPath?: string;
  isNew?: boolean;
  isPopular?: boolean;
}
