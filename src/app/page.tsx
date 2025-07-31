import LandingCard from "./components/card/LandingCard";
export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen font-bold text-white bg-black items-center ">
      <div className="px-4 pt-4 text-2xl sm:text-5xl text-blue-400 font-black ">
      DEVTOOLS.SOFTWARE
      </div>
      <div className="text-sm sm:text-xl text-semibold pt-2">
        Your One-Stop Free Toolkit for Modern Developers!
      </div>
      <div className="text-xs sm:text-sm pt-2">
        Our list of tools for free...
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-w-6xl mx-auto">
        {/* Existing Tools */}
        <a href="/qr">
          <LandingCard>
            🔲 QR Generator
          </LandingCard>
        </a>
        <a href="/json_validator">
          <LandingCard>
            📋 JSON Validator
          </LandingCard>
        </a>

        {/* Code Development Tools */}
        <a href="/regex-tester">
          <LandingCard>
            🔍 Regex Tester
          </LandingCard>
        </a>
        <a href="/code-formatter">
          <LandingCard>
            ✨ Code Formatter
          </LandingCard>
        </a>
        <a href="/code-minifier">
          <LandingCard>
            📦 Code Minifier
          </LandingCard>
        </a>
        <a href="/css-gradient-generator">
          <LandingCard>
            🌈 CSS Gradient
          </LandingCard>
        </a>
        <a href="/color-palette-generator">
          <LandingCard>
            🎨 Color Palette
          </LandingCard>
        </a>
        <a href="/meta-tag-generator">
          <LandingCard>
            🏷️ Meta Tags
          </LandingCard>
        </a>
        <a href="/box-shadow-generator">
          <LandingCard>
            📦 Box Shadow
          </LandingCard>
        </a>
        <a href="/favicon-generator">
          <LandingCard>
            🌟 Favicon Generator
          </LandingCard>
        </a>
        <a href="/border-radius-generator">
          <LandingCard>
            🔄 Border Radius
          </LandingCard>
        </a>
        <a href="/flexbox-generator">
          <LandingCard>
            📐 Flexbox Layout
          </LandingCard>
        </a>
        <a href="/css-grid-generator">
          <LandingCard>
            ⚡ CSS Grid
          </LandingCard>
        </a>
        <a href="/htaccess-generator">
          <LandingCard>
            ⚙️ .htaccess Config
          </LandingCard>
        </a>
      </div>
    </div>
  );
}
