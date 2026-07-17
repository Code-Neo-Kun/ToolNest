/**
 * Per-tool SEO data: unique title, meta description, why-use paragraph,
 * enriched howToUse steps, and FAQs (first FAQ always covers privacy/uploads).
 *
 * This is the single source of truth consumed by:
 *   - tools/[slug]/page.tsx  →  generateMetadata()
 *   - ToolLayout             →  SEO content block + FAQ accordion + JSON-LD
 */

export interface ToolSeoData {
  /** <title> tag — unique per tool, max ~60 chars */
  metaTitle: string;
  /** <meta description> — unique per tool, max 155 chars */
  metaDescription: string;
  /** H2 visible heading: "Free Online [Tool Name]" */
  h2: string;
  /** Opening paragraph: tool name + no-upload trust line + core benefit (<40 words) */
  intro: string;
  /** Numbered how-to steps shown as an <ol> and fed to HowTo schema */
  howToUse: string[];
  /** "Why use this" paragraph naming 2–3 concrete user types */
  whyUse: string;
  /** FAQs — first item MUST be about uploads/privacy */
  faqs: { question: string; answer: string }[];
}

export const TOOL_SEO: Record<string, ToolSeoData> = {

  // ── IMAGE ──────────────────────────────────────────────────────────────────

  "image-compressor": {
    metaTitle: "Free Image Compressor — Compress JPG, PNG, WebP Online | ToolNest",
    metaDescription: "Compress images online for free. No upload to server, no signup, no file size limit. Reduce JPG, PNG, and WebP file size instantly in your browser.",
    h2: "Free Online Image Compressor",
    intro: "Compress JPG, PNG, and WebP images entirely in your browser — nothing is uploaded to any server and no signup is required. Reduce file size by up to 80% while keeping visible quality sharp.",
    howToUse: [
      'Click "Choose file" or drag your image into the upload box.',
      "Adjust the quality slider — lower means a smaller file, higher means better fidelity.",
      "Click Compress and wait a moment for the result.",
      "Download your compressed image with one click.",
    ],
    whyUse: "Web developers use this to optimise images before deployment and improve Core Web Vitals scores. Online sellers compress product photos so listings load faster. Anyone emailing large photos that keep bouncing will find the instant size reduction useful.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. Compression happens entirely in your browser using WebAssembly. Your image never leaves your device." },
      { question: "What is the maximum file size?", answer: "There is no server-side limit since nothing is uploaded. The practical limit is your browser's available memory — typically fine up to 50 MB or more." },
      { question: "Will compressing reduce image quality?", answer: "Some quality loss is unavoidable with lossy compression, but the quality slider lets you find the sweet spot where file size drops significantly with no visible difference." },
      { question: "What image formats are supported?", answer: "JPG, PNG, and WebP are supported as both input and output formats." },
    ],
  },

  "image-resizer": {
    metaTitle: "Free Image Resizer — Resize Images Online | ToolNest",
    metaDescription: "Resize JPG, PNG, and WebP images to any dimension for free. No upload to server, no signup. Instant browser-based image resizing.",
    h2: "Free Online Image Resizer",
    intro: "Resize any image to exact pixel dimensions directly in your browser — no server upload and no account needed. Set a custom width and height in seconds and download the result.",
    howToUse: [
      "Upload the image you want to resize.",
      "Enter the target width and/or height in pixels.",
      "Toggle 'Maintain aspect ratio' to avoid stretching.",
      "Click Resize and download the output.",
    ],
    whyUse: "Social media managers resize images to platform specs (1200×630 for OG images, 1080×1080 for Instagram). Web developers prepare thumbnails and hero images. Students and bloggers quickly scale screenshots before embedding them in posts.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. All resizing is done in your browser on a Canvas element. Nothing is sent anywhere." },
      { question: "Will resizing affect image quality?", answer: "Upscaling (making an image larger than its original size) will reduce sharpness. Downscaling typically looks fine." },
      { question: "Can I resize to non-square dimensions?", answer: "Yes — enter any width and height. Toggle aspect-ratio lock to resize proportionally." },
      { question: "What formats are supported?", answer: "JPG, PNG, and WebP. The output is saved in the same format as the original." },
    ],
  },

  "png-to-jpg": {
    metaTitle: "Free PNG to JPG Converter — Convert PNG Online | ToolNest",
    metaDescription: "Convert PNG files to JPG format instantly in your browser. No upload, no signup, no quality loss. Free online PNG to JPG converter.",
    h2: "Free Online PNG to JPG Converter",
    intro: "Convert PNG images to JPG format instantly in your browser — no file is uploaded to any server and no account is needed. Get a smaller, web-ready JPG in seconds.",
    howToUse: [
      "Upload your PNG file.",
      "Optionally adjust the output quality (default is 90%).",
      "Click Convert and download the JPG.",
    ],
    whyUse: "Developers convert PNGs to JPG to reduce file sizes for web pages. Email users convert PNGs because many email clients display JPGs more reliably. Photographers convert screenshots or graphics to JPG before uploading to photo-sharing platforms.",
    faqs: [
      { question: "Is my file uploaded to a server?", answer: "No. The conversion runs entirely in your browser. Your files never leave your device." },
      { question: "Will I lose quality converting PNG to JPG?", answer: "JPG uses lossy compression, so some subtle detail may be lost at low quality settings. At 85–95% quality the difference is invisible for most images." },
      { question: "Does it support transparent PNGs?", answer: "Transparent areas are filled with white (the standard for JPG, which does not support transparency)." },
      { question: "Is there a file size limit?", answer: "No server-side limit. Very large files (>50 MB) may be slow depending on your device." },
    ],
  },

  "jpg-to-png": {
    metaTitle: "Free JPG to PNG Converter — Convert JPG Online | ToolNest",
    metaDescription: "Convert JPG images to PNG format online for free. No upload to server, no signup. Instant browser-based JPG to PNG conversion.",
    h2: "Free Online JPG to PNG Converter",
    intro: "Convert JPG images to lossless PNG format in your browser — nothing is uploaded to any server and no signup is required. Ideal when you need transparency support or lossless quality.",
    howToUse: [
      "Upload your JPG file.",
      "Click Convert to PNG.",
      "Download the resulting PNG file.",
    ],
    whyUse: "Designers convert JPGs to PNG when they need to add a transparent background in Photoshop or Figma. Developers need PNG for UI assets that require crisp edges at any scale. Content creators convert photos to PNG before applying overlays in video editing tools.",
    faqs: [
      { question: "Is my file uploaded to a server?", answer: "No. Conversion happens entirely in your browser using the Canvas API. Nothing leaves your device." },
      { question: "Will the PNG be larger than the JPG?", answer: "Yes. PNG is lossless, so output files are typically larger than their JPG equivalents." },
      { question: "Can I batch-convert multiple JPGs?", answer: "Currently this tool converts one file at a time. Use the file picker multiple times to convert additional images." },
      { question: "Is the conversion lossless?", answer: "The PNG output is lossless, but the original JPG may already have compression artefacts that cannot be undone." },
    ],
  },

  "image-to-base64": {
    metaTitle: "Free Image to Base64 Converter — Encode Images Online | ToolNest",
    metaDescription: "Convert images to Base64 encoded strings online for free. No upload to server, no signup. Embed images directly in HTML or CSS.",
    h2: "Free Online Image to Base64 Converter",
    intro: "Convert any image to a Base64-encoded string in your browser — nothing is uploaded to any server and no account is required. Paste the result directly into HTML, CSS, or JSON.",
    howToUse: [
      "Upload your image (JPG, PNG, WebP, GIF, or SVG).",
      "The Base64 string and a data URI are generated instantly.",
      "Copy the data URI to embed the image in HTML or CSS without a separate file.",
    ],
    whyUse: "Front-end developers embed small icons and logos as Base64 to eliminate extra HTTP requests. Email template designers inline images because many email clients block external image URLs. Mobile app developers encode images for JSON API payloads.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. Encoding happens entirely in your browser using the FileReader API. Your file never leaves your device." },
      { question: "What is a Base64 data URI?", answer: "A data URI is a string like data:image/png;base64,... that browsers can display directly without fetching an external file." },
      { question: "Should I use Base64 for large images?", answer: "No. Base64 increases file size by about 33%. It is best for small images under 10 KB. For larger images, use a regular URL." },
      { question: "What formats are supported?", answer: "Any image format your browser supports: JPG, PNG, WebP, GIF, SVG, and BMP." },
    ],
  },


  "favicon-generator": {
    metaTitle: "Free Favicon Generator — Create Favicons Online | ToolNest",
    metaDescription: "Generate standard favicon sizes from any image online for free. No upload to server, no signup. Get ICO, PNG, and manifest snippet instantly.",
    h2: "Free Online Favicon Generator",
    intro: "Generate all standard favicon sizes from any image in your browser — nothing is uploaded to any server. Get a ready-to-use favicon set and web app manifest snippet in seconds.",
    howToUse: [
      "Upload your logo or icon image (square images work best).",
      "The tool generates 16×16, 32×32, 48×48, 180×180, and 192×192 PNG favicons.",
      "Download the ZIP containing all sizes and the manifest snippet.",
      "Place the files in your site root and paste the manifest into your HTML <head>.",
    ],
    whyUse: "Web developers need correctly sized favicons for Chrome, Safari, iOS, and Android home screens. Indie makers launching a product need a professional browser tab icon before going live. SEO professionals know that a proper favicon improves click-through rate in bookmark managers and browser history.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. All resizing and conversion runs in your browser using Canvas. Nothing is sent to any server." },
      { question: "What image should I upload?", answer: "Use a square image, ideally at least 512×512 pixels, with a transparent or solid background. SVG, PNG, and JPG all work." },
      { question: "Which favicon sizes are generated?", answer: "16×16, 32×32, 48×48 (browser tabs), 180×180 (Apple touch icon), and 192×192 (Android/PWA)." },
      { question: "Do I need all the generated sizes?", answer: "At minimum you need 16×16 and 32×32 for desktop browsers. The larger sizes are needed for iOS and Android home screen icons." },
    ],
  },

  "exif-viewer-remover": {
    metaTitle: "Free EXIF Viewer & Remover — Strip Photo Metadata Online | ToolNest",
    metaDescription: "View and remove EXIF metadata from photos online for free. No upload to server, no signup. Protect your privacy before sharing images.",
    h2: "Free Online EXIF Viewer & Metadata Remover",
    intro: "Inspect and strip EXIF metadata from photos entirely in your browser — no file is uploaded to any server and no account is needed. Protect your location and device data before sharing images.",
    howToUse: [
      "Upload a JPG or image file.",
      "Review the EXIF data — GPS coordinates, camera model, date/time, and more.",
      "Click Remove EXIF to download a clean copy with all metadata stripped.",
    ],
    whyUse: "Privacy-conscious individuals remove GPS coordinates from holiday photos before posting on social media. Journalists strip device metadata from photos before publishing sensitive images. Developers audit images for unexpected metadata before committing assets to public repositories.",
    faqs: [
      { question: "Is my photo uploaded to a server?", answer: "No. EXIF reading and stripping happens entirely in your browser. Your photo never leaves your device." },
      { question: "What metadata is removed?", answer: "All EXIF data including GPS location, camera make/model, lens info, date/time, copyright, and software tags." },
      { question: "Does removing EXIF change the image visually?", answer: "No. The pixel data is untouched. Only the hidden metadata is stripped." },
      { question: "What file formats are supported?", answer: "JPEG/JPG is the primary format for EXIF data. PNG and WebP files rarely contain EXIF, but any uploaded image will be processed." },
    ],
  },

  "image-cropper": {
    metaTitle: "Free Image Cropper — Crop Images Online | ToolNest",
    metaDescription: "Crop images online for free. No upload to server, no signup. Set exact crop coordinates and size, then download instantly.",
    h2: "Free Online Image Cropper",
    intro: "Crop any image to precise dimensions in your browser — no server upload and no account required. Enter exact coordinates and pixel size, then download the result immediately.",
    howToUse: [
      "Upload your image.",
      "Set the X and Y coordinates for the top-left corner of the crop area.",
      "Set the crop width and height in pixels.",
      "Click Crop Image and download the result.",
    ],
    whyUse: "Designers crop product images to consistent aspect ratios for e-commerce listings. Developers extract specific regions from screenshots for documentation. Bloggers crop stock photos to focus on the subject before embedding them in articles.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. Cropping runs entirely in your browser using the Canvas API. Nothing leaves your device." },
      { question: "Can I crop to a non-square area?", answer: "Yes — set different width and height values to crop any rectangular area." },
      { question: "What happens if my crop area exceeds the image boundaries?", answer: "The crop is clamped to the image dimensions, so you cannot crop outside the original image bounds." },
      { question: "What formats are supported?", answer: "JPG, PNG, and WebP. The output is saved in the same format as the original file." },
    ],
  },

  "webp-converter": {
    metaTitle: "Free WebP Converter — Convert Images to WebP Online | ToolNest",
    metaDescription: "Convert JPG and PNG images to WebP format online for free. No upload, no signup. Reduce image size for faster web pages.",
    h2: "Free Online WebP Converter",
    intro: "Convert JPG and PNG images to WebP format — or back — entirely in your browser with no server upload and no signup. WebP files are typically 25–35% smaller than equivalent JPGs.",
    howToUse: [
      "Upload your JPG or PNG image.",
      "Choose whether to convert to WebP or from WebP to another format.",
      "Click Convert and download the result.",
    ],
    whyUse: "Web developers convert images to WebP to improve Google PageSpeed scores and Core Web Vitals. SEO professionals reduce image payload to boost site rankings. Anyone maintaining a WordPress or Shopify site can replace heavy JPGs with smaller WebP equivalents.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. The conversion uses your browser's Canvas API and runs entirely client-side." },
      { question: "Is WebP supported in all browsers?", answer: "WebP is supported in all modern browsers including Chrome, Firefox, Safari (since 14), and Edge. Internet Explorer does not support it." },
      { question: "How much smaller are WebP files?", answer: "Typically 25–35% smaller than JPEG and 25–75% smaller than PNG at equivalent visual quality." },
      { question: "Can I convert WebP back to JPG or PNG?", answer: "Yes — this tool converts in both directions." },
    ],
  },

  "color-palette-extractor": {
    metaTitle: "Free Color Palette Extractor — Extract Colors from Images | ToolNest",
    metaDescription: "Extract the dominant color palette from any image online for free. No upload to server, no signup. Get HEX and RGB color codes instantly.",
    h2: "Free Online Color Palette Extractor",
    intro: "Extract the dominant colors from any image in your browser — no server upload and no account required. Get HEX codes ready to paste into your CSS, Figma, or design tool.",
    howToUse: [
      "Upload your image.",
      "Click Extract Palette.",
      "Copy any HEX color code from the palette with one click.",
    ],
    whyUse: "Designers extract brand palettes from logos and photos to ensure consistent colour usage across a project. Developers pull accent colours from hero images to theme UI components. Marketing teams match ad creative to product photography colours.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. Color extraction runs entirely in your browser using the Canvas API. Nothing leaves your device." },
      { question: "How many colours are extracted?", answer: "The tool extracts the top 6 most dominant colours from the image." },
      { question: "Can I get the HEX codes?", answer: "Yes — each colour is shown with its HEX code that you can copy with one click." },
      { question: "What image formats are supported?", answer: "Any image format your browser supports: JPG, PNG, WebP, GIF, and more." },
    ],
  },

  "image-watermark": {
    metaTitle: "Free Image Watermark Tool — Add Watermark to Photos Online | ToolNest",
    metaDescription: "Add a text watermark to images online for free. No upload to server, no signup. Customise font size, opacity, colour, and position.",
    h2: "Free Online Image Watermark Tool",
    intro: "Add a custom text watermark to any image in your browser — nothing is uploaded to any server and no account is required. Control font size, opacity, colour, and position.",
    howToUse: [
      "Upload your image.",
      "Type the watermark text — e.g. your name, website, or © notice.",
      "Adjust opacity, font size, colour, and position.",
      "Click Apply Watermark, preview the result, then download.",
    ],
    whyUse: "Photographers protect their work before sharing previews with clients. Freelance designers add copyright notices to mockups before client approval. Bloggers watermark original photos before publishing to prevent unauthorised use.",
    faqs: [
      { question: "Is my image uploaded to a server?", answer: "No. The watermark is drawn on a Canvas element in your browser. Your image never leaves your device." },
      { question: "Can I add an image watermark instead of text?", answer: "Currently text watermarks are supported. Image watermark support is planned for a future update." },
      { question: "What opacity should I use?", answer: "15–25% is the standard range — visible enough to deter copying but not distracting when viewing the image normally." },
      { question: "Will the watermark affect image quality?", answer: "The image is re-encoded at 95% quality. For lossless output, use PNG as the source format." },
    ],
  },


  // ── TEXT ───────────────────────────────────────────────────────────────────

  "text-diff-checker": {
    metaTitle: "Free Text Diff Checker — Compare Text Online | ToolNest",
    metaDescription: "Compare two text blocks and highlight differences online for free. No upload, no signup. Instantly see additions, deletions, and changes.",
    h2: "Free Online Text Diff Checker",
    intro: "Compare two blocks of text and highlight every difference in your browser — no upload to any server and no account needed. See additions, deletions, and changes colour-coded side by side.",
    howToUse: [
      "Paste the original text into the left panel.",
      "Paste the updated text into the right panel.",
      "Differences are highlighted instantly.",
    ],
    whyUse: "Developers review code changes before committing. Writers compare two drafts of an article to track what changed during editing. Legal teams compare contract versions to identify modified clauses.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. The diff is computed entirely in your browser. Nothing is sent to any server." },
      { question: "What does the colour coding mean?", answer: "Green highlights text that was added. Red highlights text that was removed. Unchanged text is shown in normal colour." },
      { question: "Does it support code diffing?", answer: "Yes — you can paste any plain text including source code, JSON, CSV, or prose." },
      { question: "Is there a character or line limit?", answer: "No hard limit, but very large inputs (100 000+ characters) may slow down the browser." },
    ],
  },

  "markdown-html-converter": {
    metaTitle: "Free Markdown to HTML Converter — Convert Markdown Online | ToolNest",
    metaDescription: "Convert Markdown to HTML and HTML back to Markdown online for free. No upload, no signup. Instant browser-based conversion.",
    h2: "Free Online Markdown ↔ HTML Converter",
    intro: "Convert Markdown to HTML — or HTML back to Markdown — entirely in your browser with no upload to any server and no account required. Paste, convert, and copy in seconds.",
    howToUse: [
      "Choose the conversion direction: Markdown → HTML or HTML → Markdown.",
      "Paste your content into the input panel.",
      "Click Convert and copy the output.",
    ],
    whyUse: "Bloggers convert Markdown drafts to HTML for CMS platforms that require raw HTML. Developers convert HTML documentation to Markdown for README files. Content writers round-trip content between Markdown editors and HTML email builders.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. Conversion uses the marked and Turndown libraries running entirely in your browser." },
      { question: "What Markdown syntax is supported?", answer: "Standard CommonMark: headings, lists, links, images, bold, italic, code blocks, blockquotes, and tables." },
      { question: "Does it handle HTML with inline styles?", answer: "Turndown converts structural HTML faithfully but strips most inline styles, as Markdown has no equivalent." },
      { question: "Can I convert a full HTML page?", answer: "You can paste the body content of an HTML page. Full pages with <head> and scripts will work but the extra tags will be stripped." },
    ],
  },

  "text-to-speech": {
    metaTitle: "Free Text to Speech — Read Text Aloud Online | ToolNest",
    metaDescription: "Convert text to speech in your browser for free. No upload, no signup. Choose from all available system voices and languages.",
    h2: "Free Online Text to Speech",
    intro: "Have any text read aloud using your browser's built-in speech synthesis — no upload to any server and no account required. Choose from dozens of voices and languages available on your device.",
    howToUse: [
      "Paste or type the text you want read aloud.",
      "Select a voice from the dropdown — voices vary by operating system.",
      "Click Speak. Click Stop to end playback at any time.",
    ],
    whyUse: "Students listen back to their notes to improve retention. Accessibility testers check how screen readers will read their page content. Non-native speakers use the tool to hear correct pronunciation of written text.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. The Web Speech API runs entirely in your browser using your operating system's voice engine. Nothing is sent to any server." },
      { question: "Which browsers support this?", answer: "Chrome, Edge, and Safari have the best voice support. Firefox supports it but with fewer voices on some systems." },
      { question: "Why are there no voices in the dropdown?", answer: "Some browsers need a moment to load voices. Refresh the page and wait a second before opening the dropdown." },
      { question: "Can I change the speaking speed?", answer: "Rate control is on the roadmap. Currently the tool uses the default speech rate for the selected voice." },
    ],
  },

  "find-replace": {
    metaTitle: "Free Find & Replace Tool — Search and Replace Text Online | ToolNest",
    metaDescription: "Find and replace text online for free with regex support. No upload, no signup. Instant browser-based search and replace.",
    h2: "Free Online Find & Replace Tool",
    intro: "Search and replace text in your browser with full regex support — no upload to any server and no account required. Replace all matches globally in one click.",
    howToUse: [
      "Paste your source text into the input area.",
      "Enter the search string in the Find field.",
      "Enter the replacement in the Replace with field.",
      "Toggle regex mode for pattern-based replacements, then copy or apply the result.",
    ],
    whyUse: "Developers clean up log files or sanitise data exports before processing. Writers do bulk text substitutions across long documents. Data analysts reformat CSV fields without opening a spreadsheet application.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. All processing happens in your browser. Nothing is sent anywhere." },
      { question: "How does regex mode work?", answer: "When regex mode is on, your search string is treated as a regular expression. For example, \\d+ matches any sequence of digits." },
      { question: "Are replacements case-sensitive?", answer: "By default, replacements are case-sensitive. In regex mode you can add the i flag to make it case-insensitive: (?i)pattern." },
      { question: "Can I undo a replacement?", answer: "The original text stays in the input area until you overwrite it. Click Apply to Input to replace it, or just copy the result." },
    ],
  },

  "social-media-counter": {
    metaTitle: "Free Social Media Character Counter — Twitter, Instagram, LinkedIn | ToolNest",
    metaDescription: "Count characters for Twitter, Instagram, and LinkedIn posts online for free. No upload, no signup. See remaining characters in real time.",
    h2: "Free Online Social Media Character Counter",
    intro: "Track character limits for Twitter/X, Instagram, and LinkedIn posts in your browser — no upload to any server and no account required. See remaining characters update in real time as you type.",
    howToUse: [
      "Type or paste your post content into the text area.",
      "Switch between platform tabs (Twitter/X, Instagram, LinkedIn) to check limits.",
      "The counter shows characters used and remaining for each platform.",
    ],
    whyUse: "Social media managers draft posts without accidentally exceeding limits and getting truncated. Copywriters optimise captions to stay just under the limit for maximum impact. Community managers check whether thread-worthy content fits in a single post.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. Character counting happens entirely in your browser. Nothing is sent anywhere." },
      { question: "What are the character limits?", answer: "Twitter/X: 280 characters. Instagram captions: 2 200 characters. LinkedIn posts: 3 000 characters." },
      { question: "Does it count emojis correctly?", answer: "Yes. Emojis are counted as 2 characters on Twitter (as per their API) and 1 character on other platforms." },
      { question: "Can I check multiple platforms at once?", answer: "Yes — all platform counters are displayed simultaneously so you can compare at a glance." },
    ],
  },

  "case-converter": {
    metaTitle: "Free Case Converter — Convert Text Case Online | ToolNest",
    metaDescription: "Convert text to uppercase, lowercase, title case, camelCase, and more online for free. No upload, no signup. Instant browser-based case conversion.",
    h2: "Free Online Case Converter",
    intro: "Convert text between uppercase, lowercase, title case, camelCase, snake_case, and more — entirely in your browser with no upload to any server and no account required.",
    howToUse: [
      "Paste or type your text into the input area.",
      "Click the target case format button.",
      "Copy the converted result.",
    ],
    whyUse: "Developers convert variable names between naming conventions when refactoring. Writers fix all-caps text pasted from legacy documents. Content teams normalise product names and headings to consistent title case across a CMS.",
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. All conversions run in your browser using JavaScript. Nothing leaves your device." },
      { question: "What case formats are supported?", answer: "UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case." },
      { question: "Does it handle special characters?", answer: "Yes — accented characters and Unicode letters are handled correctly by the browser's built-in locale methods." },
      { question: "Is there a character limit?", answer: "No hard limit — paste as much text as you need." },
    ],
  },

  "lorem-ipsum": {
    metaTitle: "Free Lorem Ipsum Generator — Generate Placeholder Text Online | ToolNest",
    metaDescription: "Generate Lorem Ipsum placeholder text online for free. No signup. Choose paragraphs, words, or sentences. Instant copy.",
    h2: "Free Online Lorem Ipsum Generator",
    intro: "Generate Lorem Ipsum placeholder text instantly in your browser — no upload to any server and no account required. Choose how many paragraphs, sentences, or words you need.",
    howToUse: [
      "Select the output type: paragraphs, sentences, or words.",
      "Enter the quantity you need.",
      "Click Generate and copy the result.",
    ],
    whyUse: "UI/UX designers fill mockups with realistic-length text before real copy is ready. Web developers test layout reflow with different text volumes. Marketing teams build email templates with filler content before copywriting begins.",
    faqs: [
      { question: "Is anything sent to a server?", answer: "No. Lorem Ipsum is generated entirely in your browser from a local wordlist. Nothing is uploaded anywhere." },
      { question: "Can I generate just a few words?", answer: "Yes — switch to word mode and enter any number from 1 upwards." },
      { question: "Is the output always the same?", answer: "The classic Lorem Ipsum passage is deterministic for the first paragraph. Subsequent paragraphs are randomised." },
      { question: "Can I use this placeholder text commercially?", answer: "Lorem Ipsum is public domain text derived from Cicero's De Finibus. It is free to use for any purpose." },
    ],
  },

  "slug-generator": {
    metaTitle: "Free Slug Generator — Convert Text to URL Slugs Online | ToolNest",
    metaDescription: "Convert any text into a clean URL-friendly slug online for free. No upload, no signup. Instant slug generation.",
    h2: "Free Online Slug Generator",
    intro: "Convert any title or phrase into a clean, URL-friendly slug in your browser — no upload to any server and no account required. Perfect for blog post URLs, product handles, and route paths.",
    howToUse: [
      "Type or paste your title or phrase.",
      "The slug is generated instantly in lowercase with hyphens.",
      "Copy the slug with one click.",
    ],
    whyUse: "Bloggers generate URL slugs for new posts before publishing to a CMS like WordPress or Ghost. Developers create consistent route paths and file names. E-commerce store owners generate clean product URL handles for better SEO.",
    faqs: [
      { question: "Is my text sent to a server?", answer: "No. Slug generation runs entirely in your browser. Nothing leaves your device." },
      { question: "What characters are stripped?", answer: "All special characters, punctuation, and symbols are removed. Spaces become hyphens. Accented characters are transliterated to their ASCII equivalent." },
      { question: "Is the slug always lowercase?", answer: "Yes. Slugs are always lowercase to avoid duplicate URL issues caused by case sensitivity." },
      { question: "What is the maximum slug length?", answer: "There is no enforced maximum, but SEO best practice recommends keeping slugs under 75 characters." },
    ],
  },


  // ── DEVELOPER ──────────────────────────────────────────────────────────────

  "json-formatter": {
    metaTitle: "Free JSON Formatter & Validator — Format JSON Online | ToolNest",
    metaDescription: "Format, validate, and minify JSON payloads online for free. No upload, no signup. Instant browser-based JSON formatter.",
    h2: "Free Online JSON Formatter & Validator",
    intro: "Format, validate, and minify JSON entirely in your browser — no upload to any server and no account required. Paste messy JSON and get clean, readable output in one click.",
    howToUse: [
      "Paste your JSON into the input area.",
      "Click Format to pretty-print, Minify to compress, or Validate to check for errors.",
      "Copy the result with the Copy button.",
    ],
    whyUse: "Back-end developers format API responses to debug unexpected data shapes. Front-end developers minify JSON config files before bundling. QA engineers validate JSON payloads from test suites to ensure structural correctness.",
    faqs: [
      { question: "Is my JSON sent to a server?", answer: "No. All processing happens in your browser using JavaScript's built-in JSON.parse and JSON.stringify." },
      { question: "What causes a JSON validation error?", answer: "Common causes are trailing commas, single quotes instead of double quotes, unquoted keys, or comments — none of which are valid JSON." },
      { question: "What indent size is used?", answer: "Two spaces by default, which is the most widely adopted convention." },
      { question: "Can I format very large JSON files?", answer: "Yes, but files over 1 MB may be slow due to browser memory constraints. Consider splitting large files first." },
    ],
  },

  "base64-encoder": {
    metaTitle: "Free Base64 Encoder/Decoder — Encode & Decode Base64 Online | ToolNest",
    metaDescription: "Encode and decode Base64 strings online for free. No upload, no signup. Supports text and binary data. Instant browser-based Base64 tool.",
    h2: "Free Online Base64 Encoder & Decoder",
    intro: "Encode text or data to Base64 — or decode Base64 back to plain text — entirely in your browser with no upload to any server and no account required.",
    howToUse: [
      "Paste your text or Base64 string into the input.",
      "Click Encode to convert to Base64, or Decode to convert back to plain text.",
      "Copy the result.",
    ],
    whyUse: "Developers encode API credentials for HTTP Basic Auth headers. DevOps engineers encode Kubernetes secrets and environment variables. Front-end developers decode Base64 data URIs to inspect embedded assets.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. Encoding and decoding use the browser's built-in btoa() and atob() functions. Nothing leaves your device." },
      { question: "Can I encode binary data?", answer: "Text encoding is fully supported. For binary files (images, PDFs), use the Image to Base64 tool instead." },
      { question: "What is Base64 used for?", answer: "Base64 is used to safely transmit binary data in text-based formats like JSON, HTTP headers, and email attachments." },
      { question: "Is Base64 encryption?", answer: "No. Base64 is encoding, not encryption. Anyone can decode it without a key. Do not use it to secure sensitive data." },
    ],
  },

  "url-encoder": {
    metaTitle: "Free URL Encoder/Decoder — Encode & Decode URLs Online | ToolNest",
    metaDescription: "Encode and decode URLs online for free. No upload, no signup. Handles percent-encoding, query strings, and special characters instantly.",
    h2: "Free Online URL Encoder & Decoder",
    intro: "Encode and decode URLs with percent-encoding in your browser — no upload to any server and no account required. Handle special characters, query strings, and international characters correctly.",
    howToUse: [
      "Paste your URL or string into the input.",
      "Click Encode to percent-encode special characters, or Decode to convert %XX sequences back.",
      "Copy the result.",
    ],
    whyUse: "Developers build query strings that include special characters like &, =, and spaces. API integrators encode parameters before appending them to endpoints. SEO analysts decode encoded URLs in analytics reports to read the original parameters.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. Encoding uses JavaScript's encodeURIComponent and decodeURIComponent. Everything runs in your browser." },
      { question: "What is percent-encoding?", answer: "Percent-encoding replaces unsafe URL characters with a % followed by their hex value — e.g. space becomes %20." },
      { question: "Should I encode a full URL or just a parameter?", answer: "Encode individual query parameter values, not the entire URL. Encoding the full URL would break the protocol and domain separators." },
      { question: "What is the difference between encodeURI and encodeURIComponent?", answer: "encodeURI leaves structural URL characters (/, :, ?) intact. encodeURIComponent encodes everything except letters, digits, and - _ . ~. Use the latter for parameter values." },
    ],
  },

  "uuid-generator": {
    metaTitle: "Free UUID Generator — Generate UUIDs Online | ToolNest",
    metaDescription: "Generate random UUIDs (v4) online for free. No upload, no signup. Single or bulk UUID generation with one click copy.",
    h2: "Free Online UUID Generator",
    intro: "Generate cryptographically random UUID v4 identifiers instantly in your browser — no upload to any server and no account required. Generate one or dozens at once.",
    howToUse: [
      "Click Generate to produce a UUID.",
      "Click the copy icon to copy it to your clipboard.",
      "Generate in bulk by setting the quantity before clicking.",
    ],
    whyUse: "Back-end developers generate UUIDs for database primary keys to avoid sequential ID enumeration. Front-end developers create unique keys for React list items or form fields. DevOps engineers generate correlation IDs for distributed tracing.",
    faqs: [
      { question: "Are UUIDs sent to a server?", answer: "No. UUID v4 generation uses the browser's Web Crypto API (crypto.randomUUID or crypto.getRandomValues). Nothing leaves your device." },
      { question: "Are these UUIDs truly unique?", answer: "UUID v4 uses 122 bits of cryptographic randomness. The probability of a collision is astronomically small — approximately 1 in 5 undecillion." },
      { question: "What is a UUID v4?", answer: "UUID v4 is a randomly generated 128-bit identifier formatted as 8-4-4-4-12 hexadecimal characters, e.g. 550e8400-e29b-41d4-a716-446655440000." },
      { question: "Can I use UUIDs as database primary keys?", answer: "Yes. UUIDs are widely used as primary keys because they are globally unique across tables, databases, and systems." },
    ],
  },

  "hash-generator": {
    metaTitle: "Free Hash Generator — Generate MD5, SHA-256 Hashes Online | ToolNest",
    metaDescription: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes online for free. No upload, no signup. Instant browser-based hash generation.",
    h2: "Free Online Hash Generator",
    intro: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text in your browser — no upload to any server and no account required. Results are instant.",
    howToUse: [
      "Type or paste the text you want to hash.",
      "Select the hash algorithm (MD5, SHA-1, SHA-256, or SHA-512).",
      "Copy the hash output.",
    ],
    whyUse: "Security engineers generate SHA-256 hashes to verify file integrity after download. Developers hash passwords and tokens for comparison without storing plain text. QA teams generate checksums to confirm that build artifacts were not corrupted in transit.",
    faqs: [
      { question: "Is my text sent to a server?", answer: "No. SHA hashes are generated using the browser's Web Crypto API. MD5 is computed via a client-side library. Nothing leaves your device." },
      { question: "Is MD5 still secure?", answer: "MD5 is cryptographically broken and should not be used for security purposes. Use SHA-256 or SHA-512 for security-sensitive hashing." },
      { question: "Are hashes reversible?", answer: "No. Cryptographic hash functions are one-way. Given a hash, you cannot recover the original input — only verify a match." },
      { question: "Can I hash a file instead of text?", answer: "Text input is supported currently. File hashing support is planned for a future update." },
    ],
  },

  "cron-expression-parser": {
    metaTitle: "Free Cron Expression Parser — Parse Cron Schedules Online | ToolNest",
    metaDescription: "Parse cron expressions online for free. See next run times and human-readable schedules. No upload, no signup.",
    h2: "Free Online Cron Expression Parser",
    intro: "Parse any cron expression and see the next scheduled run times in plain English — entirely in your browser with no upload to any server and no account required.",
    howToUse: [
      "Type or paste your cron expression into the input field.",
      "The next 5 scheduled run times are shown immediately.",
      "Copy the expression to use in your CI/CD pipeline or job scheduler.",
    ],
    whyUse: "DevOps engineers verify cron schedules before deploying automated jobs. Back-end developers debug why a scheduled task is not firing at the expected time. System administrators validate backup and maintenance window schedules.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. Cron parsing uses the cron-parser library running entirely in your browser." },
      { question: "What cron format is supported?", answer: "Standard 5-field cron: minute, hour, day-of-month, month, day-of-week. Ranges, lists, wildcards, and steps (*/5) are all supported." },
      { question: "Does it support 6-field (seconds) or 7-field cron?", answer: "Currently the standard 5-field Unix cron format is supported. Seconds-level scheduling is not yet available." },
      { question: "What does */5 * * * * mean?", answer: "This runs every 5 minutes — at 00:00, 00:05, 00:10, and so on around the clock every day." },
    ],
  },

  "gitignore-generator": {
    metaTitle: "Free .gitignore Generator — Create .gitignore Files Online | ToolNest",
    metaDescription: "Generate .gitignore files for Node, Python, Java, Go, Rust, and more online for free. No signup. Multi-stack selection and instant download.",
    h2: "Free Online .gitignore Generator",
    intro: "Generate a complete .gitignore file for your project stack in your browser — no upload to any server and no account required. Select multiple stacks and download in one click.",
    howToUse: [
      "Select one or more technology stacks (Node, Python, Java, Go, etc.).",
      "Review the generated .gitignore rules.",
      "Click Download to save the file, or copy and paste it into your project root.",
    ],
    whyUse: "Developers starting new projects need a .gitignore immediately to avoid committing node_modules, virtual environments, or compiled binaries. Teams onboarding new contributors share a standard gitignore to prevent junk files appearing in PRs. Open source maintainers ensure their templates exclude IDE and OS-specific files.",
    faqs: [
      { question: "Is anything sent to a server?", answer: "No. The .gitignore content is generated from local templates in your browser. Nothing is uploaded anywhere." },
      { question: "Can I combine multiple stacks?", answer: "Yes — click multiple stack buttons to merge their rules into a single .gitignore file." },
      { question: "Where should I put the .gitignore file?", answer: "Place it in the root of your repository. Git automatically reads it and applies rules recursively." },
      { question: "Can I customise the output?", answer: "Download the file and add any project-specific paths you need. The generated content is a starting point." },
    ],
  },

  "csv-json-converter": {
    metaTitle: "Free CSV to JSON Converter — Convert CSV Online | ToolNest",
    metaDescription: "Convert CSV to JSON and JSON back to CSV online for free. No upload, no signup. Instant browser-based CSV/JSON conversion.",
    h2: "Free Online CSV ↔ JSON Converter",
    intro: "Convert CSV data to JSON — or JSON back to CSV — entirely in your browser with no upload to any server and no account required. Paste data or upload a file and download the result.",
    howToUse: [
      "Choose the conversion direction: CSV → JSON or JSON → CSV.",
      "Paste your data or upload a .csv or .json file.",
      "Click Convert and copy or download the result.",
    ],
    whyUse: "Data analysts convert CSV exports from Excel or Google Sheets into JSON for API consumption. Developers transform JSON API responses into CSV for import into spreadsheet tools. Database administrators convert table exports between formats for ETL pipelines.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. Conversion uses the papaparse library running entirely in your browser. Nothing leaves your device." },
      { question: "What CSV delimiters are supported?", answer: "Comma (,) is the default. The parser also detects semicolon (;) and tab delimiters automatically." },
      { question: "Does it handle quoted fields with commas inside?", answer: "Yes. Standard CSV quoting rules are followed — fields enclosed in double quotes can contain commas." },
      { question: "Is there a row limit?", answer: "No hard limit, but very large files (100 000+ rows) may be slow in the browser." },
    ],
  },

  "user-agent-parser": {
    metaTitle: "Free User-Agent Parser — Decode Browser & Device Info Online | ToolNest",
    metaDescription: "Parse any User-Agent string online for free. Instantly extract browser, OS, and device information. No upload, no signup.",
    h2: "Free Online User-Agent Parser",
    intro: "Decode any User-Agent string and extract browser name, version, operating system, and device type — entirely in your browser with no upload to any server and no account required.",
    howToUse: [
      "Paste a User-Agent string into the input (your current UA is auto-filled).",
      "Browser, OS, engine, and device details are shown instantly.",
      "Copy individual fields as needed.",
    ],
    whyUse: "QA engineers paste User-Agent strings from bug reports to identify the exact browser and device involved. Front-end developers debug browser-specific rendering issues by comparing UA strings. Security analysts check server logs for unusual User-Agent patterns indicating bots or scrapers.",
    faqs: [
      { question: "Is the UA string sent to a server?", answer: "No. Parsing uses the ua-parser-js library running entirely in your browser. Nothing is sent anywhere." },
      { question: "What information can be extracted?", answer: "Browser name and version, OS name and version, device type (mobile/tablet/desktop), and rendering engine." },
      { question: "Why is my User-Agent pre-filled?", answer: "The tool reads your browser's navigator.userAgent value to help you test with your own UA as a starting point." },
      { question: "How do I get the User-Agent from a bug report?", answer: "Ask the user to visit https://toolnest.app/tools/user-agent-parser and share the pre-filled value, or check your server access logs." },
    ],
  },

  "http-status-reference": {
    metaTitle: "HTTP Status Code Reference — All HTTP Status Codes Explained | ToolNest",
    metaDescription: "Look up all HTTP status codes with descriptions and real-world usage guidance. Free online HTTP status code reference. No signup required.",
    h2: "HTTP Status Code Reference",
    intro: "Look up any HTTP status code and get a plain-English explanation plus real-world usage guidance — no upload to any server and no account required. Search by code number or keyword.",
    howToUse: [
      "Type a status code (e.g. 404) or keyword (e.g. not found) in the search box.",
      "Read the description and usage notes for the matching codes.",
      "Click a code to expand full details.",
    ],
    whyUse: "API developers look up status codes to ensure they are returning semantically correct responses. Front-end developers handle API errors by code and need to know what each code means. QA engineers verify that test cases trigger the right status codes.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The reference data is bundled in the page. Everything runs in your browser." },
      { question: "What HTTP code ranges are covered?", answer: "All standard codes: 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Errors, and 5xx Server Errors." },
      { question: "What is the difference between 401 and 403?", answer: "401 Unauthorized means the request requires authentication (the user is not logged in). 403 Forbidden means the user is authenticated but does not have permission." },
      { question: "When should I use 422 vs 400?", answer: "400 Bad Request means the request is malformed (syntax error). 422 Unprocessable Entity means the request is well-formed but the data is semantically invalid (e.g. a negative age)." },
    ],
  },

  "semver-comparator": {
    metaTitle: "Free Semver Comparator — Compare Semantic Versions Online | ToolNest",
    metaDescription: "Compare semantic version strings online for free. Instantly see which version is newer. No upload, no signup.",
    h2: "Free Online Semantic Version Comparator",
    intro: "Compare two semantic version strings and determine which is newer — entirely in your browser with no upload to any server and no account required. Handles pre-release and build metadata.",
    howToUse: [
      "Enter the first version string (e.g. 1.2.3).",
      "Enter the second version string.",
      "The result shows which is greater or if they are equal.",
    ],
    whyUse: "Package maintainers verify that a new release correctly increments the version. DevOps engineers compare installed vs latest library versions in dependency audits. CI pipelines use semver comparison to decide whether to trigger a deployment.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. Version comparison is computed in your browser using standard semver parsing logic." },
      { question: "What semver format is supported?", answer: "Standard MAJOR.MINOR.PATCH format, plus pre-release identifiers (1.0.0-alpha.1) and build metadata (1.0.0+build.1)." },
      { question: "How are pre-release versions compared?", answer: "Pre-release versions have lower precedence than the release version: 1.0.0-alpha < 1.0.0. Among pre-releases, numeric identifiers are compared numerically." },
      { question: "What is semantic versioning?", answer: "Semver is a versioning scheme where MAJOR is incremented for breaking changes, MINOR for new backwards-compatible features, and PATCH for bug fixes." },
    ],
  },


  // ── SEO ────────────────────────────────────────────────────────────────────

  "meta-tag-generator": {
    metaTitle: "Free Meta Tag Generator — Generate SEO Meta Tags Online | ToolNest",
    metaDescription: "Generate SEO meta tags, Open Graph, and Twitter Card tags online for free. No upload, no signup. Real-time preview as you type.",
    h2: "Free Online Meta Tag Generator",
    intro: "Generate SEO meta tags, Open Graph tags, and Twitter Card markup in your browser — no upload to any server and no account required. Preview character counts and copy the complete snippet.",
    howToUse: [
      "Enter your page title, description, and canonical URL.",
      "Add an Open Graph image URL for social sharing previews.",
      "Copy the generated <meta> tags and paste them into your HTML <head>.",
    ],
    whyUse: "SEO professionals generate complete meta tag sets for new pages to ensure correct indexing and social sharing previews. Developers scaffold meta tags for new routes before handing off to marketing. Content creators add Twitter Cards to blog posts to improve link preview appearance on X/Twitter.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. The tags are generated entirely in your browser as you type. Nothing is uploaded anywhere." },
      { question: "What is the ideal meta description length?", answer: "Google typically shows 155–160 characters. Keep descriptions between 120–160 characters for best results." },
      { question: "What are Open Graph tags?", answer: "Open Graph tags (og:title, og:description, og:image) control how your page appears when shared on Facebook, LinkedIn, Slack, and other platforms." },
      { question: "Do meta keywords still matter for SEO?", answer: "No. Google and most major search engines have ignored the keywords meta tag since 2009. Include it for legacy compatibility only." },
    ],
  },

  "robots-generator": {
    metaTitle: "Free Robots.txt Generator — Create robots.txt Online | ToolNest",
    metaDescription: "Generate a robots.txt file for your website online for free. Control which pages search engines can crawl. No upload, no signup.",
    h2: "Free Online Robots.txt Generator",
    intro: "Generate a valid robots.txt file for your website in your browser — no upload to any server and no account required. Control which pages search engine crawlers can access.",
    howToUse: [
      "Choose the user-agent (All robots, Googlebot, or a custom agent).",
      "Set which paths to allow and which to disallow.",
      "Enter your sitemap URL.",
      "Copy the generated robots.txt and upload it to your site root.",
    ],
    whyUse: "SEO professionals use robots.txt to prevent crawlers from indexing admin pages, duplicate content, or staging environments. Developers protect private API routes from being indexed. Site owners ensure their sitemap is declared so search engines can find it.",
    faqs: [
      { question: "Is anything sent to a server?", answer: "No. The robots.txt content is generated in your browser. Nothing is uploaded." },
      { question: "Where should I place robots.txt?", answer: "It must be placed at the root of your domain: https://yourdomain.com/robots.txt. A file in a subdirectory will not be read." },
      { question: "Does robots.txt block access to a page?", answer: "No. robots.txt is a crawling directive, not a security measure. It tells well-behaved bots to skip a URL, but the URL remains publicly accessible." },
      { question: "How do I disallow all crawlers from a specific path?", answer: "Add a rule: User-agent: * followed by Disallow: /private-path/. The trailing slash ensures subdirectories are also blocked." },
    ],
  },

  "serp-snippet-preview": {
    metaTitle: "Free SERP Snippet Preview — Preview Google Search Results | ToolNest",
    metaDescription: "Preview how your page title and description appear in Google search results. Free SERP snippet simulator. No upload, no signup.",
    h2: "Free Online SERP Snippet Preview",
    intro: "Preview exactly how your page title and meta description will appear in Google search results — in your browser with no upload to any server and no account required.",
    howToUse: [
      "Enter your page title, meta description, and URL.",
      "The snippet preview updates in real time to show the Google SERP appearance.",
      "Adjust your text until the preview looks right.",
    ],
    whyUse: "SEO managers review snippet previews before publishing new pages to ensure titles are not truncated. Content marketers optimise meta descriptions for higher click-through rates. Developers verify that programmatically generated metadata renders correctly in search results.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. The snippet preview is rendered entirely in your browser. Nothing is uploaded." },
      { question: "What is the title pixel-width limit?", answer: "Google truncates titles at approximately 600px. For most sans-serif fonts this is around 60–70 characters." },
      { question: "Does the preview exactly match Google?", answer: "The preview closely approximates Google's rendering, but exact truncation may vary slightly depending on actual pixel widths of characters." },
      { question: "What happens if my title is too long?", answer: "Google will truncate it with an ellipsis (…). The tool highlights when you exceed the safe limit." },
    ],
  },

  "title-meta-description-checker": {
    metaTitle: "Free Title & Meta Description Pixel-Width Checker | ToolNest",
    metaDescription: "Check the pixel width of your page title and meta description to prevent Google truncation. Free online SEO tool. No signup.",
    h2: "Free Online Title & Meta Description Pixel-Width Checker",
    intro: "Measure the rendered pixel width of your page title and meta description in your browser — no upload to any server and no account required. Prevent Google search snippet truncation before it happens.",
    howToUse: [
      "Paste your title tag into the title field.",
      "Paste your meta description into the description field.",
      "The tool shows pixel width in real time and flags if you exceed Google's limits.",
    ],
    whyUse: "SEO professionals measure pixel width (not just character count) because wide characters like W and M consume more space than narrow ones like i and l. Content teams run titles through the checker before publishing to avoid ugly ellipsis truncation in search results.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. Pixel width is measured by rendering the text to a hidden canvas in your browser." },
      { question: "Why pixel width instead of character count?", answer: "Google truncates based on rendered pixel width, not character count. A title of 60 wide characters can be truncated while one with 70 narrow characters is fine." },
      { question: "What are the pixel-width limits?", answer: "Titles: approximately 600px. Meta descriptions: approximately 920px." },
      { question: "What font does Google use for titles?", answer: "Google uses Arial at around 20px for desktop snippets. This tool approximates that rendering." },
    ],
  },

  "hreflang-generator": {
    metaTitle: "Free Hreflang Tag Generator — Create Hreflang Tags Online | ToolNest",
    metaDescription: "Generate hreflang tags for international SEO online for free. No upload, no signup. Build correct language and regional alternate links instantly.",
    h2: "Free Online Hreflang Tag Generator",
    intro: "Generate hreflang alternate link tags for international SEO in your browser — no upload to any server and no account required. Avoid duplicate content penalties across language variants.",
    howToUse: [
      "Enter your default (x-default) page URL.",
      "Add language-URL pairs — one per language variant (e.g. en, fr, de-CH).",
      "Copy the generated hreflang tags and paste them into your HTML <head>.",
    ],
    whyUse: "International SEO specialists add hreflang tags to multilingual sites to tell Google which page to show users in each language and region. Developers building localised versions of a site need correctly formatted alternate link markup. Agencies auditing global sites check that all language variants declare each other correctly.",
    faqs: [
      { question: "Is my data sent to a server?", answer: "No. Tags are generated in your browser from your input. Nothing is uploaded." },
      { question: "What is x-default?", answer: "x-default tells search engines which page to show when no language variant matches the user's browser language — typically your English or international page." },
      { question: "Do hreflang tags need to be reciprocal?", answer: "Yes. Every page in a hreflang group must reference all other pages in the group, including itself. Missing reciprocal tags are ignored by Google." },
      { question: "Can I use hreflang for country targeting without language variation?", answer: "Yes. Use region codes like en-US and en-GB to target the same language in different countries." },
    ],
  },

  "keyword-density-checker": {
    metaTitle: "Free Keyword Density Checker — Analyse Keyword Frequency Online | ToolNest",
    metaDescription: "Check keyword density and frequency in your content online for free. No upload, no signup. Identify over-optimisation and keyword gaps instantly.",
    h2: "Free Online Keyword Density Checker",
    intro: "Analyse keyword frequency and density in any text in your browser — no upload to any server and no account required. Identify over-optimised or under-represented keywords before publishing.",
    howToUse: [
      "Paste your article or page content into the text area.",
      "The tool analyses word frequency and shows the top keywords by density.",
      "Check that your target keyword appears at a natural frequency (typically 1–2%).",
    ],
    whyUse: "Content writers use keyword density checks to ensure their target keyword appears naturally without keyword stuffing. SEO specialists audit competitor content to understand how they achieve rankings. Blog editors review articles before publishing to catch accidental over-optimisation.",
    faqs: [
      { question: "Is my content sent to a server?", answer: "No. Keyword analysis runs entirely in your browser using JavaScript. Your content never leaves your device." },
      { question: "What is a good keyword density?", answer: "1–2% is a widely cited guideline. More important than density is that the keyword appears in natural, readable prose." },
      { question: "Does Google penalise high keyword density?", answer: "Google's algorithms detect and penalise keyword stuffing. If a keyword appears unnaturally often, rewrite sentences to vary phrasing." },
      { question: "Are stop words (the, and, is) excluded?", answer: "Yes. Common stop words are filtered out so the results focus on meaningful keywords." },
    ],
  },


  // ── UTILITY ────────────────────────────────────────────────────────────────

  "unit-converter": {
    metaTitle: "Free Unit Converter — Convert Length, Weight, Temperature Online | ToolNest",
    metaDescription: "Convert length, weight, temperature, area, speed, and data size units online for free. No upload, no signup. Instant browser-based unit conversion.",
    h2: "Free Online Unit Converter",
    intro: "Convert between length, weight, temperature, area, speed, and data size units in your browser — no upload to any server and no account required. Results update instantly.",
    howToUse: [
      "Select the unit category (length, weight, temperature, etc.).",
      "Enter the value to convert.",
      "Select the source and target units — the result updates immediately.",
    ],
    whyUse: "Engineers convert between metric and imperial units for international projects. Students solve physics and chemistry problems requiring unit conversion. Travellers convert miles to kilometres, Fahrenheit to Celsius, or pounds to kilograms.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. All conversions are computed in your browser using standard conversion factors. Nothing is uploaded." },
      { question: "How accurate are the conversions?", answer: "Results are shown to 8 significant figures using precise conversion factors." },
      { question: "What unit categories are available?", answer: "Length, weight/mass, temperature, area, speed, and data size (bits to terabytes)." },
      { question: "Why does the result change when I switch category?", answer: "Unit keys are reset to the first two in the new category to prevent stale values from a previous category causing incorrect results." },
    ],
  },

  "age-date-difference": {
    metaTitle: "Free Age Calculator & Date Difference Tool | ToolNest",
    metaDescription: "Calculate age or the difference between two dates online for free. Get years, months, and days. No upload, no signup.",
    h2: "Free Online Age Calculator & Date Difference Tool",
    intro: "Calculate the exact age or interval between any two dates in years, months, and days — in your browser with no upload to any server and no account required.",
    howToUse: [
      "Enter the birth date (or start date).",
      "Enter the target date (defaults to today).",
      "The result shows the exact interval in years, months, and days.",
    ],
    whyUse: "Parents calculate their child's exact age in months for medical visits. HR teams calculate employee tenure in years and months. Developers compute expiry dates and age verification thresholds for applications.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The calculation runs entirely in your browser. Nothing is uploaded." },
      { question: "Does it account for leap years?", answer: "Yes. The calculator uses actual calendar month lengths, so February 29 dates are handled correctly." },
      { question: "Can I calculate the difference between two past dates?", answer: "Yes — enter any two dates in the past, present, or future." },
      { question: "Is the result exact?", answer: "The result is precise to the day level. For hour and minute precision, use a dedicated time difference tool." },
    ],
  },

  "bmi-calculator": {
    metaTitle: "Free BMI Calculator — Calculate Body Mass Index Online | ToolNest",
    metaDescription: "Calculate your BMI (Body Mass Index) online for free. Supports metric and imperial units. No upload, no signup.",
    h2: "Free Online BMI Calculator",
    intro: "Calculate your Body Mass Index from height and weight in your browser — no upload to any server and no account required. Supports both metric (kg/cm) and imperial (lb/in) units.",
    howToUse: [
      "Select metric or imperial units.",
      "Enter your height and weight.",
      "Your BMI and category (Underweight, Normal, Overweight, Obese) are shown instantly.",
    ],
    whyUse: "Individuals track their BMI as a general health indicator during fitness goals. Healthcare students learn BMI calculations for clinical assessments. Fitness app developers use this as a reference to validate their own BMI formula implementations.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The BMI calculation runs entirely in your browser. Nothing is uploaded or stored." },
      { question: "What is the BMI formula?", answer: "BMI = weight (kg) ÷ height (m)². For imperial: BMI = 703 × weight (lb) ÷ height (in)²." },
      { question: "What do the BMI categories mean?", answer: "Under 18.5: Underweight. 18.5–24.9: Normal. 25–29.9: Overweight. 30 and above: Obese. These are general guidelines — consult a healthcare professional for medical advice." },
      { question: "Is BMI an accurate health measure?", answer: "BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, or body fat distribution." },
    ],
  },

  "world-clock": {
    metaTitle: "Free World Clock & Timezone Converter — Convert Times Online | ToolNest",
    metaDescription: "Convert times between timezones online for free. View live clocks in multiple zones. No upload, no signup.",
    h2: "Free Online World Clock & Timezone Converter",
    intro: "Compare live times across multiple timezones in your browser — no upload to any server and no account required. Clocks update every second using your browser's timezone data.",
    howToUse: [
      "Select a source timezone — defaults to your local time.",
      "Select a target timezone to convert to.",
      "Both clocks update live every second.",
    ],
    whyUse: "Remote teams coordinate meeting times across continents. Freelancers schedule calls with international clients without manual time conversion. Travellers plan departure and arrival times across multiple timezone changes.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The clock uses your browser's Intl.DateTimeFormat API. No data leaves your device." },
      { question: "How accurate is the time shown?", answer: "The clock reads from your system clock, which is typically accurate to within a second via NTP synchronisation." },
      { question: "Why is my timezone not in the list?", answer: "A common set of timezones is pre-loaded. If your specific region is missing, selecting the nearest equivalent will give the same result for most purposes." },
      { question: "Does it account for daylight saving time?", answer: "Yes. The Intl API uses your operating system's timezone database which includes current DST rules." },
    ],
  },

  "random-generators": {
    metaTitle: "Free Random Generator — Dice, Coin, Numbers & More | ToolNest",
    metaDescription: "Generate random numbers, dice rolls, coin flips, and names online for free. No upload, no signup. Cryptographically random results.",
    h2: "Free Online Random Generators",
    intro: "Generate random numbers, dice rolls, coin flips, and random names in your browser — using cryptographically secure randomness with no upload to any server and no account required.",
    howToUse: [
      "Choose a generator type: dice, coin, number range, or name.",
      "Set any options (number of dice, range, etc.).",
      "Click Generate for a new random result.",
    ],
    whyUse: "Board gamers roll digital dice when physical dice are unavailable. Teachers randomly select students for participation. Developers seed test data with random values for unit tests.",
    faqs: [
      { question: "Are the results truly random?", answer: "Yes. Results use the browser's crypto.getRandomValues API, which generates cryptographically secure random numbers." },
      { question: "Is any data sent to a server?", answer: "No. All generation happens in your browser." },
      { question: "Can I roll multiple dice at once?", answer: "Yes — set the number of dice and the sides, and all rolls are shown simultaneously." },
      { question: "Can I generate a random number in a specific range?", answer: "Yes — enter a minimum and maximum value and the generator produces a uniformly random integer in that range." },
    ],
  },

  "password-generator": {
    metaTitle: "Free Password Generator — Generate Secure Passwords Online | ToolNest",
    metaDescription: "Generate strong, secure passwords online for free. No upload, no signup. Customise length, character sets, and copy with one click.",
    h2: "Free Online Secure Password Generator",
    intro: "Generate cryptographically secure passwords in your browser — nothing is sent to any server and no account is required. Customise length, uppercase, numbers, and symbols.",
    howToUse: [
      "Set the desired password length.",
      "Toggle character sets: uppercase, lowercase, numbers, symbols.",
      "Click Generate and copy your password.",
    ],
    whyUse: "Security-conscious individuals generate unique strong passwords for every new account. IT administrators create initial credentials for employee accounts. Developers generate API keys and temporary tokens for testing.",
    faqs: [
      { question: "Are generated passwords sent to a server?", answer: "No. Passwords are generated using the browser's crypto.getRandomValues API. They are never transmitted anywhere." },
      { question: "How strong is a 16-character password?", answer: "A random 16-character password using uppercase, lowercase, digits, and symbols has over 10^29 possible combinations — it would take billions of years to brute-force." },
      { question: "Should I use a password manager?", answer: "Yes. Generated passwords are strong but hard to memorise. A password manager like Bitwarden or 1Password stores them securely." },
      { question: "Can I generate multiple passwords at once?", answer: "Yes — set the quantity field to generate a list of passwords in one click." },
    ],
  },

  "qr-generator": {
    metaTitle: "Free QR Code Generator — Create QR Codes Online | ToolNest",
    metaDescription: "Generate QR codes for URLs, text, WiFi, and more online for free. Customise size and colours. Download as PNG. No signup.",
    h2: "Free Online QR Code Generator",
    intro: "Generate QR codes for any URL, text, email, phone number, or WiFi credentials — no upload to any server and no account required. Customise size and colours, then download as PNG.",
    howToUse: [
      "Enter the content to encode: a URL, phone number (tel:+1234567890), email (mailto:), or plain text.",
      "Adjust the size and foreground/background colours.",
      "The QR code updates automatically. Click Download PNG to save.",
    ],
    whyUse: "Restaurant owners create QR codes that link to digital menus. Event organisers encode registration URLs for printed programmes. Developers embed deep links in printed documentation.",
    faqs: [
      { question: "Is my content sent to a server?", answer: "QR code generation uses the qrserver.com API to render the image. Your content (URL or text) is included in that API request. Do not encode sensitive information like passwords." },
      { question: "What can I encode in a QR code?", answer: "URLs, plain text, phone numbers (tel:), email addresses (mailto:), WiFi credentials (WIFI:S:name;T:WPA;P:password;;), and vCards." },
      { question: "What size should I use for printing?", answer: "At least 300×300px for standard print. Use 500px or more for large format posters. The code should be at least 1cm × 1cm when printed." },
      { question: "Are QR codes free to use commercially?", answer: "Yes. The QR code standard is open. This generator is also free for commercial use." },
    ],
  },

  "color-picker": {
    metaTitle: "Free Color Picker — Convert HEX, RGB, HSL Colors Online | ToolNest",
    metaDescription: "Pick colours and convert between HEX, RGB, and HSL formats online for free. No upload, no signup. Instant colour conversion.",
    h2: "Free Online Color Picker & Converter",
    intro: "Pick any colour and instantly convert between HEX, RGB, and HSL formats in your browser — no upload to any server and no account required.",
    howToUse: [
      "Use the colour picker to select a colour visually.",
      "Or type a HEX, RGB, or HSL value directly.",
      "All three formats update simultaneously. Copy any value.",
    ],
    whyUse: "Web designers pick colours from a visual palette and copy the HEX code directly into CSS. Developers convert colour values between formats when working with different CSS frameworks. Brand managers verify that specific HEX brand colours match their RGB equivalents.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. Colour conversion runs entirely in your browser using JavaScript math. Nothing is uploaded." },
      { question: "What colour formats are supported?", answer: "HEX (#rrggbb), RGB (rgb(r, g, b)), and HSL (hsl(h, s%, l%))." },
      { question: "What is the difference between RGB and HSL?", answer: "RGB defines colour by red, green, and blue channel values (0–255). HSL defines it by hue (0–360°), saturation (%), and lightness (%)." },
      { question: "Can I enter an 8-digit HEX (with alpha)?", answer: "8-digit HEX (#rrggbbaa) is not yet supported. Alpha channel support is planned." },
    ],
  },

  "percentage-calculator": {
    metaTitle: "Free Percentage Calculator — Calculate Percentages Online | ToolNest",
    metaDescription: "Calculate percentages, percentage changes, and ratios online for free. No upload, no signup. Instant browser-based percentage calculator.",
    h2: "Free Online Percentage Calculator",
    intro: "Calculate percentages, percentage changes, and ratios in your browser — no upload to any server and no account required. Multiple calculation modes cover every common use case.",
    howToUse: [
      "Select the calculation type: percentage of a number, percentage change, or what percentage X is of Y.",
      "Enter the values.",
      "The result updates instantly.",
    ],
    whyUse: "Students calculate grades and test score percentages. Sales professionals calculate discount amounts and commission rates. Analysts compute month-over-month percentage changes for reports.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. All calculations run in your browser. Nothing is uploaded." },
      { question: "What types of percentage calculations are supported?", answer: "X% of Y, percentage change between two values, and what percentage X is of Y." },
      { question: "How do I calculate a percentage increase?", answer: "Use the percentage change mode: enter the old value and new value. The result shows the percentage increase or decrease." },
      { question: "How do I calculate a discount?", answer: "Use the X% of Y mode: enter the discount percentage and the original price to get the discount amount." },
    ],
  },


  // ── FINANCE ────────────────────────────────────────────────────────────────

  "emi-calculator": {
    metaTitle: "Free EMI Calculator — Calculate Loan EMI Online | ToolNest",
    metaDescription: "Calculate monthly loan EMI, total payable amount, and interest online for free. No upload, no signup. Instant browser-based EMI calculator.",
    h2: "Free Online EMI Calculator",
    intro: "Calculate your monthly loan EMI, total interest, and total payable amount in your browser — no upload to any server and no account required. Works for home loans, car loans, and personal loans.",
    howToUse: [
      "Enter the loan principal amount.",
      "Enter the annual interest rate.",
      "Enter the loan tenure in months or years.",
      "Your EMI, total interest, and total payable amount are shown instantly.",
    ],
    whyUse: "Home buyers calculate whether a mortgage fits their monthly budget before applying. Car buyers compare EMIs across different loan tenures. Small business owners evaluate whether a business loan repayment is sustainable.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The EMI calculation runs entirely in your browser. Nothing is uploaded or stored." },
      { question: "What is the EMI formula?", answer: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate, and n is the number of months." },
      { question: "Does the calculator account for processing fees?", answer: "No. The result shows the pure EMI based on principal, rate, and tenure. Add processing fees separately." },
      { question: "Can I calculate EMI for a reducing balance loan?", answer: "Yes. The standard EMI formula used here is based on the reducing balance method, which is the most common for bank loans." },
    ],
  },

  "gst-calculator": {
    metaTitle: "Free GST Calculator — Calculate GST Online | ToolNest",
    metaDescription: "Calculate GST amount, total payable, and taxable amount online for free. Supports all GST rates. No upload, no signup.",
    h2: "Free Online GST Calculator",
    intro: "Calculate GST amounts, total payable, and taxable base in your browser — no upload to any server and no account required. Add or remove GST at any standard rate.",
    howToUse: [
      "Enter the amount (exclusive or inclusive of GST).",
      "Select the GST rate (5%, 12%, 18%, 28%, or custom).",
      "Choose whether the amount is exclusive or inclusive of GST.",
      "The GST amount, base price, and total are shown instantly.",
    ],
    whyUse: "Small business owners calculate GST to include on invoices. Consumers verify the GST component of a quoted price. Accountants quickly compute GST liability for returns.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The calculation runs entirely in your browser. Nothing is uploaded." },
      { question: "What GST rates are supported?", answer: "Standard Indian GST rates: 0%, 5%, 12%, 18%, and 28%. Custom rates are also supported." },
      { question: "How do I calculate GST-exclusive price from a GST-inclusive total?", answer: "Switch the input mode to 'GST inclusive'. Enter the total amount and select the rate — the base price and GST component are separated automatically." },
      { question: "Does this support IGST and CGST/SGST split?", answer: "The GST amount shown is the total. For inter-state transactions, split it 50/50 between CGST and SGST." },
    ],
  },

  "roi-calculator": {
    metaTitle: "Free ROI Calculator — Calculate Return on Investment Online | ToolNest",
    metaDescription: "Calculate ROI, profit/loss, and total investment value online for free. No upload, no signup. Instant browser-based ROI calculator.",
    h2: "Free Online ROI Calculator",
    intro: "Calculate return on investment, profit or loss, and total value in your browser — no upload to any server and no account required. Compare multiple investment scenarios instantly.",
    howToUse: [
      "Enter the initial investment amount.",
      "Enter the final value or gain.",
      "Your ROI percentage, profit/loss, and total value are shown instantly.",
    ],
    whyUse: "Investors evaluate whether a stock, property, or business investment is meeting targets. Marketing managers calculate the ROI of advertising campaigns. Entrepreneurs compare return across different business opportunities.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The ROI calculation runs entirely in your browser. Nothing is uploaded." },
      { question: "What is the ROI formula?", answer: "ROI = (Net Profit / Cost of Investment) × 100. Net Profit = Final Value − Initial Investment." },
      { question: "Does it account for time period?", answer: "The basic ROI formula does not account for time. For annualised returns, use the CAGR calculator." },
      { question: "What is a good ROI?", answer: "It depends on the asset class. Stock market average is ~10% annually. Real estate typically 8–12%. Individual investments vary widely." },
    ],
  },

  "compound-interest-calculator": {
    metaTitle: "Free Compound Interest Calculator — Calculate Investment Growth | ToolNest",
    metaDescription: "Calculate compound interest growth for savings and investments online for free. No upload, no signup. See year-by-year growth breakdown.",
    h2: "Free Online Compound Interest Calculator",
    intro: "Calculate how savings or investments grow with compound interest in your browser — no upload to any server and no account required. See year-by-year breakdowns with any compounding frequency.",
    howToUse: [
      "Enter the principal amount.",
      "Enter the annual interest rate.",
      "Set the time period and compounding frequency (monthly, quarterly, annually).",
      "Total value and interest earned are shown with a year-by-year breakdown.",
    ],
    whyUse: "Savers project how much a fixed deposit or savings account will grow over 10–30 years. Investors model long-term stock portfolio returns. Students learning finance concepts visualise the power of compound interest.",
    faqs: [
      { question: "Is any data sent to a server?", answer: "No. The calculation runs entirely in your browser. Nothing is uploaded." },
      { question: "What is the compound interest formula?", answer: "A = P × (1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding periods per year, and t is years." },
      { question: "How does compounding frequency affect returns?", answer: "More frequent compounding produces slightly higher returns. Monthly compounding earns more than annual compounding at the same rate." },
      { question: "Does the calculator include regular contributions?", answer: "A simple lump-sum calculator is shown by default. The tool also supports regular monthly contributions." },
    ],
  },


  // ── PDF ────────────────────────────────────────────────────────────────────

  "pdf-merge": {
    metaTitle: "Free PDF Merger — Combine PDF Files Online | ToolNest",
    metaDescription: "Merge multiple PDF files into one document online for free. No upload to server, no signup. Drag to reorder pages before combining.",
    h2: "Free Online PDF Merger",
    intro: "Combine multiple PDF files into a single document in your browser — nothing is uploaded to any server and no account is required. Drag to reorder files before merging.",
    howToUse: [
      "Upload two or more PDF files.",
      "Drag the rows to set the order in the final PDF.",
      "Click Merge PDFs — the combined file downloads automatically.",
    ],
    whyUse: "Office workers combine monthly report PDFs into a single year-end document. Students merge lecture slide PDFs into one study file. Lawyers compile contract appendices into a single submission.",
    faqs: [
      { question: "Are my PDFs uploaded to a server?", answer: "No. Merging uses the pdf-lib library running entirely in your browser. Your files never leave your device." },
      { question: "Is there a limit on the number of files?", answer: "No hard limit. Add as many PDFs as needed." },
      { question: "Can I reorder pages after merging?", answer: "Use the Organize PDF tool to reorder individual pages." },
      { question: "Does it work with password-protected PDFs?", answer: "Encrypted PDFs cannot be processed. Remove the password first using a PDF tool that supports decryption." },
    ],
  },

  "pdf-split": {
    metaTitle: "Free PDF Splitter — Split PDF Files Online | ToolNest",
    metaDescription: "Split PDF files into separate documents by page range online for free. No upload to server, no signup. Instant browser-based PDF splitting.",
    h2: "Free Online PDF Splitter",
    intro: "Split a PDF into separate files by page range in your browser — nothing is uploaded to any server and no account is required. Each range downloads as its own PDF.",
    howToUse: [
      "Upload your PDF file.",
      'Enter page ranges separated by commas — e.g. "1-3, 5, 7-9".',
      "Click Split PDF — each range downloads as a separate file.",
    ],
    whyUse: "Students extract specific chapters from a large textbook PDF. Professionals extract the signature page from a long contract before signing. Developers split a combined log PDF into per-service files for easier analysis.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. Splitting uses the pdf-lib library in your browser. Nothing is sent anywhere." },
      { question: "How do I specify page ranges?", answer: "Enter comma-separated ranges like 1-3, 5, 8-10. Each range produces a separate output PDF." },
      { question: "Can I split every page into its own file?", answer: "Yes — enter each page as a single-page range: 1, 2, 3, ..." },
      { question: "Is there a page limit?", answer: "No hard limit. Very large PDFs may be slow depending on your device memory." },
    ],
  },

  "pdf-remove-pages": {
    metaTitle: "Free PDF Page Remover — Delete Pages from PDF Online | ToolNest",
    metaDescription: "Remove selected pages from a PDF file online for free. No upload to server, no signup. Click pages to delete and download instantly.",
    h2: "Free Online PDF Page Remover",
    intro: "Delete selected pages from a PDF file in your browser — nothing is uploaded to any server and no account is required. Click the page numbers to select them, then download the cleaned PDF.",
    howToUse: [
      "Upload your PDF file.",
      "Click the page number buttons to select pages for removal (they highlight in red).",
      "Click Remove Selected Pages to download the PDF with those pages deleted.",
    ],
    whyUse: "Professionals remove blank or confidential pages before sharing documents. Students delete irrelevant appendix pages from study materials. Office admins strip cover pages or fax headers from scanned documents.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. All processing uses pdf-lib in your browser. Nothing leaves your device." },
      { question: "Can I undo page removal?", answer: "The original file on your device is never modified. Re-upload to start over." },
      { question: "Can I remove all pages?", answer: "No. At least one page must remain. The tool prevents deletion of all pages." },
      { question: "Is there a page count limit?", answer: "No hard limit — works for PDFs of any length." },
    ],
  },

  "pdf-extract-pages": {
    metaTitle: "Free PDF Page Extractor — Extract Pages from PDF Online | ToolNest",
    metaDescription: "Extract specific pages from a PDF into a new document online for free. No upload to server, no signup.",
    h2: "Free Online PDF Page Extractor",
    intro: "Pull specific pages from a PDF into a new document in your browser — nothing is uploaded to any server and no account is required. Cherry-pick any combination of pages.",
    howToUse: [
      "Upload your PDF file.",
      "Click page numbers to select the pages you want to keep.",
      "Click Extract Pages — the selected pages download as a new PDF.",
    ],
    whyUse: "Researchers extract relevant sections from long academic PDFs for focused reading. Sales teams extract the pricing page from a proposal to share separately. Admins extract specific form pages from multi-form document bundles.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. pdf-lib processes everything in your browser. Nothing is sent anywhere." },
      { question: "How is this different from Split PDF?", answer: "Split PDF divides a PDF into multiple range-based files. Extract Pages lets you select any pages and combines them into a single output." },
      { question: "Can I select pages in any order?", answer: "Yes. Pages are extracted in ascending order regardless of the order you click them." },
      { question: "Is the original file affected?", answer: "No. The original file on your device is never modified." },
    ],
  },

  "pdf-rotate": {
    metaTitle: "Free PDF Rotator — Rotate PDF Pages Online | ToolNest",
    metaDescription: "Rotate PDF pages 90°, 180°, or 270° online for free. Rotate all pages or select specific ones. No upload to server, no signup.",
    h2: "Free Online PDF Page Rotator",
    intro: "Rotate pages in a PDF by 90°, 180°, or 270° in your browser — nothing is uploaded to any server and no account is required. Rotate all pages or select specific ones.",
    howToUse: [
      "Upload your PDF file.",
      "Choose the rotation angle (90°, 180°, or 270°).",
      "Choose whether to rotate all pages or select specific ones.",
      "Click Rotate PDF and download the result.",
    ],
    whyUse: "Office workers fix scanned documents that were fed into the scanner sideways. Students rotate landscape lecture slides to portrait for easier reading on a phone. Anyone who receives a PDF with incorrectly oriented pages corrects them before printing.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. Rotation uses pdf-lib in your browser. Nothing leaves your device." },
      { question: "Can I rotate only specific pages?", answer: "Yes — select 'Selected pages' mode and click the page number buttons." },
      { question: "Is the rotation permanent?", answer: "The downloaded file has the rotation baked in, but your original file is never modified." },
      { question: "Does it support counter-clockwise rotation?", answer: "Yes. Selecting 90° counter-clockwise is equivalent to 270° clockwise — both options are available." },
    ],
  },

  "pdf-add-page-numbers": {
    metaTitle: "Free PDF Page Numbering Tool — Add Page Numbers to PDF Online | ToolNest",
    metaDescription: "Add page numbers to any PDF online for free. Choose position, starting number, and font size. No upload to server, no signup.",
    h2: "Free Online PDF Page Number Stamper",
    intro: "Stamp page numbers onto every page of a PDF in your browser — nothing is uploaded to any server and no account is required. Choose position, starting number, and font size.",
    howToUse: [
      "Upload your PDF file.",
      "Choose the position (bottom centre, bottom right, top centre, etc.).",
      "Set the starting page number and font size.",
      "Click Add Page Numbers and download the result.",
    ],
    whyUse: "Professionals adding page numbers to contracts and reports before final submission. Students numbering compiled study materials for easy reference. Admins preparing multi-page documents for printing and binding.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. Page numbers are drawn using pdf-lib in your browser. Nothing is sent anywhere." },
      { question: "Can I start numbering from a page other than 1?", answer: "Yes. Set the starting number to any value — useful if this document continues from a previous one." },
      { question: "What font is used?", answer: "Helvetica, a standard built-in PDF font that requires no external embedding." },
      { question: "Can I add numbers to only some pages?", answer: "Currently the tool numbers all pages. Per-page selection is planned." },
    ],
  },

  "pdf-watermark": {
    metaTitle: "Free PDF Watermark Tool — Add Watermark to PDF Online | ToolNest",
    metaDescription: "Add a text watermark to every page of a PDF online for free. Control opacity, angle, and size. No upload to server, no signup.",
    h2: "Free Online PDF Watermark Tool",
    intro: "Add a diagonal text watermark to every page of a PDF in your browser — nothing is uploaded to any server and no account is required. Control opacity, angle, font size, and text.",
    howToUse: [
      "Upload your PDF file.",
      "Type your watermark text (e.g. CONFIDENTIAL or DRAFT).",
      "Adjust opacity, font size, and angle.",
      "Click Add Watermark and download the result.",
    ],
    whyUse: "Law firms stamp draft contracts with DRAFT before client review. Government agencies mark documents CONFIDENTIAL before distribution. Freelancers add their name or website to PDF proposals before sending to clients.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. The watermark is drawn using pdf-lib in your browser. Nothing leaves your device." },
      { question: "What opacity should I use for a subtle watermark?", answer: "15–25% is the standard — visible enough to identify the document status but not distracting when reading." },
      { question: "Can I add an image watermark?", answer: "Text watermarks are supported. Image watermark support is planned for a future update." },
      { question: "Can the watermark be removed?", answer: "Watermarks added by this tool are embedded as page content and cannot be easily removed without specialist software." },
    ],
  },

  "pdf-crop": {
    metaTitle: "Free PDF Crop Tool — Crop PDF Pages Online | ToolNest",
    metaDescription: "Crop PDF pages by setting margin values online for free. Remove unwanted borders and whitespace. No upload to server, no signup.",
    h2: "Free Online PDF Crop Tool",
    intro: "Crop the visible area of PDF pages by setting margins in your browser — nothing is uploaded to any server and no account is required. Remove unwanted borders and whitespace.",
    howToUse: [
      "Upload your PDF file.",
      "Enter the margin values in PDF points (72pt = 1 inch) for top, right, bottom, and left.",
      "Click Crop PDF and download the result.",
    ],
    whyUse: "Students crop scanned textbooks to remove oversized white borders before reading on a tablet. Developers crop auto-generated PDF reports to remove excess padding. Designers trim bleed margins from exported PDFs before sharing.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. Cropping uses pdf-lib in your browser. Nothing leaves your device." },
      { question: "What unit are the margin values in?", answer: "PDF points (pt). 72pt = 1 inch. An A4 page is 595×842pt, and a US Letter page is 612×792pt." },
      { question: "Does cropping reduce file size?", answer: "The crop box hides content outside the new boundaries but does not physically remove it, so file size stays roughly the same." },
      { question: "Can I crop individual pages differently?", answer: "Currently the same crop values are applied to all pages. Per-page cropping is planned." },
    ],
  },

  "jpg-to-pdf": {
    metaTitle: "Free JPG to PDF Converter — Convert Images to PDF Online | ToolNest",
    metaDescription: "Convert JPG and PNG images to PDF online for free. Combine multiple images into one PDF. No upload to server, no signup.",
    h2: "Free Online JPG to PDF Converter",
    intro: "Convert JPG and PNG images into a single PDF document in your browser — nothing is uploaded to any server and no account is required. Combine multiple images, drag to reorder, and choose page size.",
    howToUse: [
      "Upload one or more JPG or PNG images.",
      "Drag the image rows to set the page order.",
      "Choose a page size (A4, US Letter, or Fit to image).",
      "Click Convert to PDF and download the result.",
    ],
    whyUse: "Students scan handwritten notes as photos and combine them into a PDF for submission. Freelancers compile portfolio images into a single presentable PDF. Office workers convert scanned receipts and invoices to PDF for expense reports.",
    faqs: [
      { question: "Are my images uploaded to a server?", answer: "No. Conversion uses pdf-lib in your browser. Your files never leave your device." },
      { question: "What image formats are supported?", answer: "JPEG and PNG. WebP support is planned." },
      { question: "What does 'Fit to image' page size mean?", answer: "Each PDF page is sized exactly to the image dimensions with no white borders or scaling." },
      { question: "Is there a limit on the number of images?", answer: "No hard limit. Very large images or many files may be slow depending on your device memory." },
    ],
  },

  "pdf-organize": {
    metaTitle: "Free PDF Organizer — Reorder PDF Pages Online | ToolNest",
    metaDescription: "Drag and drop to reorder, rotate, and delete pages in a PDF online for free. No upload to server, no signup.",
    h2: "Free Online PDF Page Organizer",
    intro: "Reorder, rotate, and delete pages in a PDF using drag-and-drop in your browser — nothing is uploaded to any server and no account is required. All changes are applied together when you save.",
    howToUse: [
      "Upload your PDF file.",
      "Drag page rows to reorder them.",
      "Click the rotate icon to rotate a page 90° clockwise.",
      "Click the trash icon to remove a page.",
      "Click Save & Download to get the reorganised PDF.",
    ],
    whyUse: "Professionals reorder pages in contracts and reports before final submission. Students reorganise lecture slides into a logical study order. Anyone who receives a PDF with pages in the wrong order can fix it in seconds.",
    faqs: [
      { question: "Are my files uploaded to a server?", answer: "No. All reorganisation uses pdf-lib in your browser. Nothing is sent anywhere." },
      { question: "Can I undo changes?", answer: "Re-upload the original file to start over. The original on your device is never modified." },
      { question: "Can I rotate and reorder on the same pass?", answer: "Yes. All changes — order, rotation, and deletions — are applied in one save operation." },
      { question: "Is there a page limit?", answer: "No hard limit. PDFs with 500+ pages may be slow to load in the browser." },
    ],
  },

  // ── TEXT (continued) ───────────────────────────────────────────────────────

  "markdown-editor": {
    metaTitle: "Free Online Markdown Editor — Write & Preview Markdown | ToolNest",
    metaDescription: "Write, preview, and export Markdown in your browser for free. Live side-by-side preview, word count, and download as .md or .html. No signup.",
    h2: "Free Online Markdown Editor",
    intro: "Write Markdown and see a live preview side by side — entirely in your browser with no upload to any server and no account required. Download your document as .md or .html in one click.",
    howToUse: [
      "Type or paste your Markdown in the left editor pane.",
      "The preview pane on the right updates in real time.",
      "Use Clean to strip trailing whitespace, or Clear to start fresh.",
      "Download your document as .md (Markdown source) or .html (rendered page).",
    ],
    whyUse: "Bloggers draft and preview posts before pasting into their CMS. Developers write README files with a live preview before committing. Technical writers compose documentation and export it as HTML for publishing.",
    faqs: [
      { question: "Is my content sent to a server?", answer: "No. Everything runs in your browser using the marked library. Nothing is uploaded anywhere." },
      { question: "What Markdown syntax is supported?", answer: "CommonMark: headings, bold, italic, inline code, fenced code blocks, lists, blockquotes, links, images, and tables." },
      { question: "Can I export my document?", answer: "Yes — click .md to download the raw Markdown source, or .html to download a complete HTML page with your rendered content." },
      { question: "Does it auto-save my work?", answer: "There is no server-side saving. Your content persists while the browser tab stays open. For persistent storage, download a copy." },
    ],
  },

};
