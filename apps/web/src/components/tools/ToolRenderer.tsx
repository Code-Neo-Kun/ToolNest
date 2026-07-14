"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

interface ToolRendererProps {
  componentPath: string | undefined;
}

type ToolComponent = ComponentType<Record<string, never>>;

const TOOL_LOADERS: Record<string, () => Promise<ToolComponent>> = {
  "@/components/tools/image/ImageCompressorTool": () =>
    import("@/components/tools/image/ImageCompressorTool").then(
      (mod) => mod.ImageCompressorTool,
    ),
  "@/components/tools/image/ImageResizerTool": () =>
    import("@/components/tools/image/ImageResizerTool").then(
      (mod) => mod.ImageResizerTool,
    ),
  "@/components/tools/image/PngToJpgTool": () =>
    import("@/components/tools/image/PngToJpgTool").then(
      (mod) => mod.PngToJpgTool,
    ),
  "@/components/tools/image/JpgToPngTool": () =>
    import("@/components/tools/image/JpgToPngTool").then(
      (mod) => mod.JpgToPngTool,
    ),
  "@/components/tools/image/ImageToBase64Tool": () =>
    import("@/components/tools/image/ImageToBase64Tool").then(
      (mod) => mod.ImageToBase64Tool,
    ),
  "@/components/tools/text/WordCounterTool": () =>
    import("@/components/tools/text/WordCounterTool").then(
      (mod) => mod.WordCounterTool,
    ),
  "@/components/tools/text/CaseConverterTool": () =>
    import("@/components/tools/text/CaseConverterTool").then(
      (mod) => mod.CaseConverterTool,
    ),
  "@/components/tools/text/LoremIpsumTool": () =>
    import("@/components/tools/text/LoremIpsumTool").then(
      (mod) => mod.LoremIpsumTool,
    ),
  "@/components/tools/text/SlugGeneratorTool": () =>
    import("@/components/tools/text/SlugGeneratorTool").then(
      (mod) => mod.SlugGeneratorTool,
    ),
  "@/components/tools/developer/JsonFormatterTool": () =>
    import("@/components/tools/developer/JsonFormatterTool").then(
      (mod) => mod.JsonFormatterTool,
    ),
  "@/components/tools/developer/Base64EncoderTool": () =>
    import("@/components/tools/developer/Base64EncoderTool").then(
      (mod) => mod.Base64EncoderTool,
    ),
  "@/components/tools/developer/UrlEncoderTool": () =>
    import("@/components/tools/developer/UrlEncoderTool").then(
      (mod) => mod.UrlEncoderTool,
    ),
  "@/components/tools/developer/UuidGeneratorTool": () =>
    import("@/components/tools/developer/UuidGeneratorTool").then(
      (mod) => mod.UuidGeneratorTool,
    ),
  "@/components/tools/developer/HashGeneratorTool": () =>
    import("@/components/tools/developer/HashGeneratorTool").then(
      (mod) => mod.HashGeneratorTool,
    ),
  "@/components/tools/seo/MetaTagGeneratorTool": () =>
    import("@/components/tools/seo/MetaTagGeneratorTool").then(
      (mod) => mod.MetaTagGeneratorTool,
    ),
  "@/components/tools/seo/RobotsGeneratorTool": () =>
    import("@/components/tools/seo/RobotsGeneratorTool").then(
      (mod) => mod.RobotsGeneratorTool,
    ),
  "@/components/tools/utility/PasswordGeneratorTool": () =>
    import("@/components/tools/utility/PasswordGeneratorTool").then(
      (mod) => mod.PasswordGeneratorTool,
    ),
  "@/components/tools/utility/QrGeneratorTool": () =>
    import("@/components/tools/utility/QrGeneratorTool").then(
      (mod) => mod.QrGeneratorTool,
    ),
  "@/components/tools/utility/ColorPickerTool": () =>
    import("@/components/tools/utility/ColorPickerTool").then(
      (mod) => mod.ColorPickerTool,
    ),
  "@/components/tools/utility/PercentageCalculatorTool": () =>
    import("@/components/tools/utility/PercentageCalculatorTool").then(
      (mod) => mod.PercentageCalculatorTool,
    ),
  "@/components/tools/productivity/MarkdownEditorTool": () =>
    import("@/components/tools/productivity/MarkdownEditorTool").then(
      (mod) => mod.MarkdownEditorTool,
    ),
  "@/components/tools/finance/EmiCalculatorTool": () =>
    import("@/components/tools/finance/EmiCalculatorTool").then(
      (mod) => mod.EmiCalculatorTool,
    ),
  "@/components/tools/finance/GstCalculatorTool": () =>
    import("@/components/tools/finance/GstCalculatorTool").then(
      (mod) => mod.GstCalculatorTool,
    ),
  "@/components/tools/finance/RoiCalculatorTool": () =>
    import("@/components/tools/finance/RoiCalculatorTool").then(
      (mod) => mod.RoiCalculatorTool,
    ),
  "@/components/tools/finance/CompoundInterestCalculatorTool": () =>
    import("@/components/tools/finance/CompoundInterestCalculatorTool").then(
      (mod) => mod.CompoundInterestCalculatorTool,
    ),
  "@/components/tools/image/FaviconGeneratorTool": () =>
    import("@/components/tools/image/FaviconGeneratorTool").then(
      (mod) => mod.FaviconGeneratorTool,
    ),
  "@/components/tools/image/ExifViewerRemoverTool": () =>
    import("@/components/tools/image/ExifViewerRemoverTool").then(
      (mod) => mod.ExifViewerRemoverTool,
    ),
  "@/components/tools/image/ImageCropperTool": () =>
    import("@/components/tools/image/ImageCropperTool").then(
      (mod) => mod.ImageCropperTool,
    ),
  "@/components/tools/image/WebpConverterTool": () =>
    import("@/components/tools/image/WebpConverterTool").then(
      (mod) => mod.WebpConverterTool,
    ),
  "@/components/tools/image/ColorPaletteExtractorTool": () =>
    import("@/components/tools/image/ColorPaletteExtractorTool").then(
      (mod) => mod.ColorPaletteExtractorTool,
    ),
  "@/components/tools/image/ImageWatermarkTool": () =>
    import("@/components/tools/image/ImageWatermarkTool").then(
      (mod) => mod.ImageWatermarkTool,
    ),
  "@/components/tools/text/TextDiffCheckerTool": () =>
    import("@/components/tools/text/TextDiffCheckerTool").then(
      (mod) => mod.TextDiffCheckerTool,
    ),
  "@/components/tools/text/MarkdownHtmlConverterTool": () =>
    import("@/components/tools/text/MarkdownHtmlConverterTool").then(
      (mod) => mod.MarkdownHtmlConverterTool,
    ),
  "@/components/tools/text/TextToSpeechTool": () =>
    import("@/components/tools/text/TextToSpeechTool").then(
      (mod) => mod.TextToSpeechTool,
    ),
  "@/components/tools/text/FindReplaceTool": () =>
    import("@/components/tools/text/FindReplaceTool").then(
      (mod) => mod.FindReplaceTool,
    ),
  "@/components/tools/text/SocialMediaCounterTool": () =>
    import("@/components/tools/text/SocialMediaCounterTool").then(
      (mod) => mod.SocialMediaCounterTool,
    ),
  "@/components/tools/developer/CronExpressionParserTool": () =>
    import("@/components/tools/developer/CronExpressionParserTool").then(
      (mod) => mod.CronExpressionParserTool,
    ),
  "@/components/tools/developer/GitignoreGeneratorTool": () =>
    import("@/components/tools/developer/GitignoreGeneratorTool").then(
      (mod) => mod.GitignoreGeneratorTool,
    ),
  "@/components/tools/developer/CsvJsonConverterTool": () =>
    import("@/components/tools/developer/CsvJsonConverterTool").then(
      (mod) => mod.CsvJsonConverterTool,
    ),
  "@/components/tools/developer/UserAgentParserTool": () =>
    import("@/components/tools/developer/UserAgentParserTool").then(
      (mod) => mod.UserAgentParserTool,
    ),
  "@/components/tools/developer/HttpStatusReferenceTool": () =>
    import("@/components/tools/developer/HttpStatusReferenceTool").then(
      (mod) => mod.HttpStatusReferenceTool,
    ),
  "@/components/tools/developer/SemverComparatorTool": () =>
    import("@/components/tools/developer/SemverComparatorTool").then(
      (mod) => mod.SemverComparatorTool,
    ),
  "@/components/tools/seo/SerpSnippetPreviewTool": () =>
    import("@/components/tools/seo/SerpSnippetPreviewTool").then(
      (mod) => mod.SerpSnippetPreviewTool,
    ),
  "@/components/tools/seo/MetaPixelWidthCheckerTool": () =>
    import("@/components/tools/seo/MetaPixelWidthCheckerTool").then(
      (mod) => mod.MetaPixelWidthCheckerTool,
    ),
  "@/components/tools/seo/HreflangGeneratorTool": () =>
    import("@/components/tools/seo/HreflangGeneratorTool").then(
      (mod) => mod.HreflangGeneratorTool,
    ),
  "@/components/tools/seo/KeywordDensityCheckerTool": () =>
    import("@/components/tools/seo/KeywordDensityCheckerTool").then(
      (mod) => mod.KeywordDensityCheckerTool,
    ),
  "@/components/tools/utility/UnitConverterTool": () =>
    import("@/components/tools/utility/UnitConverterTool").then(
      (mod) => mod.UnitConverterTool,
    ),
  "@/components/tools/utility/AgeDateDifferenceTool": () =>
    import("@/components/tools/utility/AgeDateDifferenceTool").then(
      (mod) => mod.AgeDateDifferenceTool,
    ),
  "@/components/tools/utility/BmiCalculatorTool": () =>
    import("@/components/tools/utility/BmiCalculatorTool").then(
      (mod) => mod.BmiCalculatorTool,
    ),
  "@/components/tools/utility/WorldClockTool": () =>
    import("@/components/tools/utility/WorldClockTool").then(
      (mod) => mod.WorldClockTool,
    ),
  "@/components/tools/utility/RandomGeneratorsTool": () =>
    import("@/components/tools/utility/RandomGeneratorsTool").then(
      (mod) => mod.RandomGeneratorsTool,
    ),
  // ── PDF Tools ─────────────────────────────────────────────────────────────
  "@/components/tools/pdf/PdfMergeTool": () =>
    import("@/components/tools/pdf/PdfMergeTool").then(
      (mod) => mod.PdfMergeTool,
    ),
  "@/components/tools/pdf/PdfSplitTool": () =>
    import("@/components/tools/pdf/PdfSplitTool").then(
      (mod) => mod.PdfSplitTool,
    ),
  "@/components/tools/pdf/PdfRemovePagesTool": () =>
    import("@/components/tools/pdf/PdfRemovePagesTool").then(
      (mod) => mod.PdfRemovePagesTool,
    ),
  "@/components/tools/pdf/PdfExtractPagesTool": () =>
    import("@/components/tools/pdf/PdfExtractPagesTool").then(
      (mod) => mod.PdfExtractPagesTool,
    ),
  "@/components/tools/pdf/PdfRotateTool": () =>
    import("@/components/tools/pdf/PdfRotateTool").then(
      (mod) => mod.PdfRotateTool,
    ),
  "@/components/tools/pdf/PdfPageNumbersTool": () =>
    import("@/components/tools/pdf/PdfPageNumbersTool").then(
      (mod) => mod.PdfPageNumbersTool,
    ),
  "@/components/tools/pdf/PdfWatermarkTool": () =>
    import("@/components/tools/pdf/PdfWatermarkTool").then(
      (mod) => mod.PdfWatermarkTool,
    ),
  "@/components/tools/pdf/PdfCropTool": () =>
    import("@/components/tools/pdf/PdfCropTool").then(
      (mod) => mod.PdfCropTool,
    ),
  "@/components/tools/pdf/JpgToPdfTool": () =>
    import("@/components/tools/pdf/JpgToPdfTool").then(
      (mod) => mod.JpgToPdfTool,
    ),
  "@/components/tools/pdf/PdfOrganizeTool": () =>
    import("@/components/tools/pdf/PdfOrganizeTool").then(
      (mod) => mod.PdfOrganizeTool,
    ),
};

export default function ToolRenderer({ componentPath }: ToolRendererProps) {
  if (!componentPath) {
    return null;
  }

  const loader = TOOL_LOADERS[componentPath];
  if (!loader) {
    return <div className="p-6">Tool component not registered.</div>;
  }

  const ToolComponent = dynamic(loader, {
    loading: () => <div className="p-6">Loading tool…</div>,
  });

  return <ToolComponent />;
}
