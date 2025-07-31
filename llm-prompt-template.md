# 🤖 LLM Implementation Prompt Template

## How to Use This Prompt

1. **Copy the prompt below**
2. **Replace `{TOOL_NAME}` with the specific tool** (e.g., "URL Encoder/Decoder")
3. **Replace `{TOOL_PATH}` with the route path** (e.g., "/url-encoder")
4. **Replace `{TOOL_GUIDE_FILE}` with the relevant guide** (e.g., "tools-text-document.md")
5. **Replace `{TOOL_SECTION}` with the specific section** (e.g., "### 1. URL Encoder/Decoder")
6. **Send to your LLM of choice**

---

## 🎯 COMPLETE IMPLEMENTATION PROMPT

```
You are an expert Next.js/React developer tasked with implementing a specific tool for devtools.software. I need you to create a complete, production-ready implementation following our established design system and requirements.

## 📋 TASK OVERVIEW
Implement: **{TOOL_NAME}**
Route Path: **{TOOL_PATH}**
Reference Guide: **{TOOL_GUIDE_FILE}**

## 🎨 DESIGN SYSTEM REQUIREMENTS
You MUST follow our established UI design system. Here are the key requirements:

### Color Palette
- Background: `bg-black` (main), `bg-gray-900` (containers), `bg-gray-800` (inputs)
- Text: `text-white` (primary), `text-gray-300` (secondary), `text-blue-400` (accents)
- Buttons: `bg-blue-600 hover:bg-blue-700` (primary), `bg-gray-700 hover:bg-gray-600` (secondary)
- Borders: `border-gray-700` (default), `border-blue-500` (focus)
- Status: `text-green-400` (success), `text-red-400` (error), `text-yellow-400` (warning)

### Component Standards
- Use consistent spacing: `p-4`, `p-6`, `p-8`, `gap-4`, `gap-6`
- Round corners: `rounded-lg`, `rounded-xl`
- Shadows: `shadow-xl` for containers
- Responsive: Always include `md:` breakpoints
- Focus states: `focus:ring-2 focus:ring-blue-500 focus:border-transparent`

### Required Component Structure
```tsx
export default function ToolPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* SEO Head component */}
      <Head>
        <title>{TOOL_NAME} | Free Online Tool | devtools.software</title>
        <meta name="description" content="[Tool description with keywords]" />
        <meta property="og:title" content="{TOOL_NAME}" />
        <meta property="og:description" content="[Tool description]" />
        <meta property="og:url" content="https://devtools.software{TOOL_PATH}" />
        <meta name="robots" content="index,follow" />
      </Head>

      {/* Tool Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-black text-white">{TOOL_NAME}</h1>
          <p className="text-lg md:text-xl text-blue-100 mt-2">[Tool description]</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8 shadow-xl">
            {/* Tool interface goes here */}
          </div>
        </div>
      </main>
    </div>
  );
}
```

## 📁 FILE STRUCTURE REQUIREMENTS
Create the following file:
- **Path**: `src/app{TOOL_PATH}/page.tsx`
- **Name**: `page.tsx`
- **Location**: Exactly at `src/app{TOOL_PATH}/page.tsx`

## 🛠️ TECHNICAL REQUIREMENTS

### Next.js/React Standards
- Use Next.js 15+ with App Router
- Use TypeScript with proper types
- Use 'use client' directive if needed for interactivity
- Follow React best practices and hooks

### Functionality Requirements
- **Client-side processing only** (no server calls for tool functionality)
- **Real-time processing** with debouncing (300ms) for text inputs
- **Error handling** with user-friendly messages
- **Copy to clipboard** functionality with visual feedback
- **Download/export** functionality where applicable
- **Mobile responsiveness** and touch-friendly interfaces
- **Keyboard navigation** support
- **Loading states** for any processing

### Input/Output Patterns
- Use consistent input styling: `bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white`
- Use consistent output styling: `bg-gray-800 border border-gray-700 rounded-lg p-4`
- Include clear labels and help text
- Show character/file size limits
- Provide examples and usage instructions

### Required Features
- **Copy Button**: With clipboard icon and "Copied!" feedback
- **Download Button**: When applicable, with proper file naming
- **Clear/Reset Button**: To clear all inputs and outputs
- **Error States**: With clear error messages and recovery instructions
- **Loading States**: With spinner or progress indicators
- **Example Data**: Pre-filled examples users can try
- **Help Text**: Instructions and usage tips

## 📊 SPECIFIC IMPLEMENTATION DETAILS

### From {TOOL_GUIDE_FILE}:
{TOOL_SECTION}

### Additional Requirements:
- **SEO Optimization**: Include relevant keywords in meta tags
- **Performance**: Fast processing, efficient algorithms
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **User Experience**: Intuitive interface, clear feedback, helpful examples

## 🎯 DELIVERABLES

Provide the complete implementation with:

1. **Full page.tsx file** with all functionality
2. **Proper TypeScript types** for all props and state
3. **Error handling** for edge cases
4. **Responsive design** that works on mobile
5. **SEO-optimized** meta tags and content
6. **User-friendly** interface with clear instructions
7. **Working copy/download** functionality
8. **Loading states** and user feedback

## ✅ QUALITY CHECKLIST

Ensure your implementation includes:
- [ ] Follows the exact color palette and component styling
- [ ] Has proper TypeScript types
- [ ] Includes comprehensive error handling
- [ ] Works on mobile devices (responsive design)
- [ ] Has copy to clipboard functionality
- [ ] Includes download/export when applicable
- [ ] Has loading states for processing
- [ ] Includes helpful examples and instructions
- [ ] Has proper SEO meta tags
- [ ] Uses client-side processing only
- [ ] Follows Next.js App Router patterns
- [ ] Has consistent spacing and layout
- [ ] Includes keyboard navigation support

## 🚨 CRITICAL NOTES
- **No external API calls** for core tool functionality
- **Privacy-first**: All processing happens client-side
- **Performance**: Keep processing fast and responsive
- **Consistency**: Match the existing QR generator and JSON validator styling
- **Quality**: This should be production-ready code

Please implement the complete tool following all these requirements. The implementation should be ready to deploy and use immediately.
```

---

## 📋 QUICK REFERENCE: Tool Categories & Paths

### 📝 Text & Document Tools (tools-text-document.md)
1. URL Encoder/Decoder → `/url-encoder`
2. Base64 Encoder/Decoder → `/base64`
3. Hash Generator → `/hash-generator`
4. Text Diff Checker → `/text-diff`
5. Word/Character Counter → `/text-counter`
6. Case Converter → `/case-converter`
7. Lorem Ipsum Generator → `/lorem-ipsum`
8. Password Generator → `/password-generator`
9. Markdown to HTML → `/markdown-to-html`
10. HTML to Markdown → `/html-to-markdown`
11. ASCII Art Generator → `/ascii-art`
12. Duplicate Line Remover → `/remove-duplicates`

### 💻 Code & Development Tools (tools-code-development.md)
1. Code Formatter → `/code-formatter`
2. Code Minifier → `/code-minifier`
3. Regex Tester → `/regex-tester`
4. Color Palette Generator → `/color-palette`
5. CSS Gradient Generator → `/css-gradient`
6. Box Shadow Generator → `/box-shadow`
7. Border Radius Generator → `/border-radius`
8. Flexbox Generator → `/flexbox-generator`
9. CSS Grid Generator → `/css-grid`
10. Favicon Generator → `/favicon-generator`
11. Meta Tag Generator → `/meta-tags`
12. .htaccess Generator → `/htaccess-generator`

### 📊 Data & API Tools (tools-data-api.md)
1. JSON Formatter → `/json-formatter` (enhance existing)
2. XML Formatter → `/xml-formatter`
3. YAML to JSON → `/yaml-to-json`
4. CSV to JSON → `/csv-to-json`
5. SQL Formatter → `/sql-formatter`
6. API Response Formatter → `/api-formatter`
7. Mock Data Generator → `/mock-data`
8. Database Schema Visualizer → `/db-schema`
9. REST API Tester → `/api-tester`
10. GraphQL Query Builder → `/graphql-builder`
11. JWT Decoder → `/jwt-decoder`
12. Unix Timestamp Converter → `/timestamp-converter`

### 🖼️ Image & Media Tools (tools-image-media.md)
1. Image Compressor → `/image-compressor`
2. Image Converter → `/image-converter`
3. Image Resizer → `/image-resizer`
4. Color Picker → `/color-picker`
5. Image to Base64 → `/image-to-base64`
6. SVG Optimizer → `/svg-optimizer`
7. Photo Filters → `/photo-filters`
8. Barcode Generator → `/barcode-generator`
9. Meme Generator → `/meme-generator`
10. Watermark Tool → `/watermark-tool`

### 📄 Document Processing (tools-document-processing.md)
1. PDF to Word → `/pdf-to-word` ⭐⭐⭐
2. PDF to Excel → `/pdf-to-excel` ⭐⭐⭐
3. Word to PDF → `/word-to-pdf` ⭐⭐⭐
4. Excel to PDF → `/excel-to-pdf`
5. PowerPoint to PDF → `/powerpoint-to-pdf`
6. PDF Merge/Split → `/pdf-merge-split`
7. PDF Compressor → `/pdf-compressor`
8. PDF Unlock → `/pdf-unlock`
9. PDF Extract Pages → `/pdf-extract-pages`
10. Document Viewer → `/document-viewer`
11. OCR Text Extraction → `/ocr-text-extraction`
12. E-book Converter → `/ebook-converter`

### 🔢 Calculators & Converters (tools-calculators-converters.md)
1. Unit Converter → `/unit-converter`
2. Currency Converter → `/currency-converter`
3. Percentage Calculator → `/percentage-calculator`
4. BMI Calculator → `/bmi-calculator`
5. Age Calculator → `/age-calculator`
6. Date Calculator → `/date-calculator`
7. Time Zone Converter → `/timezone-converter`
8. Loan Calculator → `/loan-calculator`
9. Tax Calculator → `/tax-calculator`
10. Tip Calculator → `/tip-calculator`
11. Scientific Calculator → `/scientific-calculator`
12. Programming Calculator → `/programming-calculator`

---

## 🚀 RECOMMENDED IMPLEMENTATION ORDER

### Week 1: High-Impact Tools
1. **URL Encoder/Decoder** (Simple, high demand)
2. **Base64 Encoder/Decoder** (Developer essential)
3. **Unit Converter** (Universal utility)
4. **Image Compressor** (High search volume)

### Week 2: Developer Focus
5. **Code Formatter** (Developer essential)
6. **JSON Formatter Enhancement** (Upgrade existing)
7. **Hash Generator** (Security focus)
8. **Regex Tester** (Popular developer tool)

### Week 3: Business Value
9. **PDF to Word Converter** (500K+ monthly searches)
10. **CSV to JSON Converter** (Data processing)
11. **Percentage Calculator** (Everyday use)
12. **Password Generator** (Security essential)

Just replace the placeholders in the prompt template and send it to your LLM for each tool implementation!
