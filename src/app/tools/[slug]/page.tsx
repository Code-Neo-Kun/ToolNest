import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getToolBySlug } from "@/lib/tools-registry";
import { ImageCompressorTool } from "@/components/tools/image/ImageCompressorTool";
import { ImageResizerTool } from "@/components/tools/image/ImageResizerTool";
import { PngToJpgTool } from "@/components/tools/image/PngToJpgTool";
import { JpgToPngTool } from "@/components/tools/image/JpgToPngTool";
import { ImageToBase64Tool } from "@/components/tools/image/ImageToBase64Tool";
import { WordCounterTool } from "@/components/tools/text/WordCounterTool";
import { CaseConverterTool } from "@/components/tools/text/CaseConverterTool";
import { LoremIpsumTool } from "@/components/tools/text/LoremIpsumTool";
import { SlugGeneratorTool } from "@/components/tools/text/SlugGeneratorTool";
import { JsonFormatterTool } from "@/components/tools/developer/JsonFormatterTool";
import { Base64EncoderTool } from "@/components/tools/developer/Base64EncoderTool";
import { UrlEncoderTool } from "@/components/tools/developer/UrlEncoderTool";
import { UuidGeneratorTool } from "@/components/tools/developer/UuidGeneratorTool";
import { HashGeneratorTool } from "@/components/tools/developer/HashGeneratorTool";
import { MetaTagGeneratorTool } from "@/components/tools/seo/MetaTagGeneratorTool";
import { RobotsGeneratorTool } from "@/components/tools/seo/RobotsGeneratorTool";
import { PasswordGeneratorTool } from "@/components/tools/utility/PasswordGeneratorTool";
import { QrGeneratorTool } from "@/components/tools/utility/QrGeneratorTool";
import { ColorPickerTool } from "@/components/tools/utility/ColorPickerTool";
import { PercentageCalculatorTool } from "@/components/tools/utility/PercentageCalculatorTool";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.name} — Free Online Tool`,
      description: tool.description,
      type: "website",
    },
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
  };
}

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  "image-compressor": ImageCompressorTool,
  "image-resizer": ImageResizerTool,
  "png-to-jpg": PngToJpgTool,
  "jpg-to-png": JpgToPngTool,
  "image-to-base64": ImageToBase64Tool,
  "word-counter": WordCounterTool,
  "case-converter": CaseConverterTool,
  "lorem-ipsum": LoremIpsumTool,
  "slug-generator": SlugGeneratorTool,
  "json-formatter": JsonFormatterTool,
  "base64-encoder": Base64EncoderTool,
  "url-encoder": UrlEncoderTool,
  "uuid-generator": UuidGeneratorTool,
  "hash-generator": HashGeneratorTool,
  "meta-tag-generator": MetaTagGeneratorTool,
  "robots-generator": RobotsGeneratorTool,
  "password-generator": PasswordGeneratorTool,
  "qr-generator": QrGeneratorTool,
  "color-picker": ColorPickerTool,
  "percentage-calculator": PercentageCalculatorTool,
};

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = TOOL_COMPONENTS[slug];
  if (!ToolComponent) notFound();

  return <ToolComponent />;
}
