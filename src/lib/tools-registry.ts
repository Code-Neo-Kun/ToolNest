export type ToolCategory =
  | "image"
  | "pdf"
  | "text"
  | "developer"
  | "seo"
  | "utility";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  keywords: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

export const TOOLS: Tool[] = [
  // Image
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Compress JPG, PNG, WebP images online for free. Reduce file size without losing quality.",
    category: "image",
    icon: "🗜️",
    keywords: ["compress", "image", "jpg", "png", "webp", "reduce size"],
    isPopular: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images online to any dimension. Maintain aspect ratio or set custom width and height.",
    category: "image",
    icon: "↔️",
    keywords: ["resize", "image", "dimension", "width", "height"],
    isPopular: true,
  },
  {
    slug: "png-to-jpg",
    name: "PNG to JPG",
    description: "Convert PNG images to JPG format online for free. Fast and easy conversion.",
    category: "image",
    icon: "🖼️",
    keywords: ["png", "jpg", "jpeg", "convert", "image"],
  },
  {
    slug: "jpg-to-png",
    name: "JPG to PNG",
    description: "Convert JPG/JPEG images to PNG format online. Free and instant conversion.",
    category: "image",
    icon: "🖼️",
    keywords: ["jpg", "jpeg", "png", "convert", "image"],
  },
  {
    slug: "image-to-base64",
    name: "Image to Base64",
    description: "Convert images to Base64 encoded string online. Useful for embedding images in HTML/CSS.",
    category: "image",
    icon: "🔤",
    keywords: ["image", "base64", "encode", "convert", "embed"],
    isNew: true,
  },
  // Text
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and paragraphs in your text. Free online word counter.",
    category: "text",
    icon: "📝",
    keywords: ["word", "counter", "character", "count", "text"],
    isPopular: true,
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    description: "Convert text to uppercase, lowercase, title case, camelCase, snake_case and more.",
    category: "text",
    icon: "🔡",
    keywords: ["case", "uppercase", "lowercase", "titlecase", "camelcase", "convert"],
  },
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    description: "Generate Lorem Ipsum placeholder text. Choose paragraphs, sentences, or words.",
    category: "text",
    icon: "📄",
    keywords: ["lorem", "ipsum", "placeholder", "dummy", "text"],
  },
  {
    slug: "slug-generator",
    name: "Slug Generator",
    description: "Convert text to URL-friendly slugs. Perfect for blog posts, URLs, and file names.",
    category: "text",
    icon: "🔗",
    keywords: ["slug", "url", "friendly", "convert", "text"],
    isNew: true,
  },
  // Developer
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify JSON online. Minify JSON or make it readable.",
    category: "developer",
    icon: "{ }",
    keywords: ["json", "format", "validate", "beautify", "minify"],
    isPopular: true,
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings online. Convert text to Base64 and back.",
    category: "developer",
    icon: "🔐",
    keywords: ["base64", "encode", "decode", "convert", "string"],
  },
  {
    slug: "url-encoder",
    name: "URL Encoder/Decoder",
    description: "Encode or decode URLs online. Convert special characters to percent-encoded format.",
    category: "developer",
    icon: "🌐",
    keywords: ["url", "encode", "decode", "percent", "uri"],
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    description: "Generate random UUIDs (v4) online. Create unique identifiers instantly.",
    category: "developer",
    icon: "🆔",
    keywords: ["uuid", "guid", "unique", "id", "generate", "random"],
    isPopular: true,
  },
  {
    slug: "hash-generator",
    name: "Hash Generator",
    description: "Generate MD5, SHA-1, SHA-256, SHA-512 hashes online. Free hash calculator.",
    category: "developer",
    icon: "#️⃣",
    keywords: ["hash", "md5", "sha", "sha256", "sha512", "encrypt"],
    isNew: true,
  },
  // SEO
  {
    slug: "meta-tag-generator",
    name: "Meta Tag Generator",
    description: "Generate SEO meta tags for your website. Includes Open Graph and Twitter Card tags.",
    category: "seo",
    icon: "🏷️",
    keywords: ["meta", "tag", "seo", "opengraph", "twitter", "generator"],
    isPopular: true,
  },
  {
    slug: "robots-generator",
    name: "Robots.txt Generator",
    description: "Generate robots.txt file for your website. Control how search engines crawl your site.",
    category: "seo",
    icon: "🤖",
    keywords: ["robots", "txt", "seo", "crawl", "search engine"],
  },
  // Utility
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure passwords online. Customize length and character types.",
    category: "utility",
    icon: "🔑",
    keywords: ["password", "generate", "secure", "random", "strong"],
    isPopular: true,
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes online for free. Create QR codes for URLs, text, and more.",
    category: "utility",
    icon: "⬛",
    keywords: ["qr", "code", "generate", "qrcode", "barcode"],
    isPopular: true,
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick colors and convert between HEX, RGB, HSL color formats. Free online color tool.",
    category: "utility",
    icon: "🎨",
    keywords: ["color", "picker", "hex", "rgb", "hsl", "convert"],
    isNew: true,
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages online. Find what percent of a number is, or percentage change.",
    category: "utility",
    icon: "%",
    keywords: ["percentage", "calculate", "percent", "math", "calculator"],
  },
];

export const CATEGORIES: Record<ToolCategory, { label: string; description: string; icon: string; color: string }> = {
  image: {
    label: "Image Tools",
    description: "Compress, resize, convert and edit images",
    icon: "🖼️",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  pdf: {
    label: "PDF Tools",
    description: "Merge, split, compress and convert PDFs",
    icon: "📄",
    color: "bg-red-50 text-red-700 border-red-200",
  },
  text: {
    label: "Text Tools",
    description: "Count, convert and manipulate text",
    icon: "📝",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  developer: {
    label: "Developer Tools",
    description: "JSON, Base64, UUID, Hash and more",
    icon: "⚡",
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  seo: {
    label: "SEO Tools",
    description: "Meta tags, robots, sitemaps and more",
    icon: "🔍",
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  utility: {
    label: "Utility Tools",
    description: "Password, QR codes, calculators and more",
    icon: "🛠️",
    color: "bg-teal-50 text-teal-700 border-teal-200",
  },
};

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return TOOLS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  return TOOLS.filter((t) => t.slug !== tool.slug && t.category === tool.category).slice(0, limit);
}

export function getPopularTools(): Tool[] {
  return TOOLS.filter((t) => t.isPopular);
}

export function getNewTools(): Tool[] {
  return TOOLS.filter((t) => t.isNew);
}
