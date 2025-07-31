"use client";
import React, { useState, useMemo } from "react";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import EnhancedLandingCard from "./components/EnhancedLandingCard";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import { toolsData, getToolsByCategory, searchTools } from "./components/toolsData";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(() => {
    if (searchQuery) {
      return searchTools(searchQuery);
    }
    return getToolsByCategory(activeCategory);
  }, [searchQuery, activeCategory]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setActiveCategory("all");
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero />
        
        {/* Search and Filter Section */}
        <div className="w-full max-w-6xl mx-auto px-4 mb-8 animate-slideUp animation-delay-800">
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            activeCategory={activeCategory} 
            onCategoryChange={handleCategoryChange} 
          />
        </div>

        {/* Tools Grid Section */}
        <div className="w-full max-w-7xl mx-auto px-4 mb-16 animate-fadeIn">
          {/* Results Header */}
          <div className="mb-8 text-center animate-slideUp">
            <h2 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? (
                <>Search Results for &quot;{searchQuery}&quot;</>
              ) : (
                <>Available Tools</>
              )}
            </h2>
            <p className="text-gray-400">
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <EnhancedLandingCard
                key={tool.id}
                href={tool.href}
                icon={tool.icon}
                category={tool.category}
                description={tool.description}
                delay={index * 0.05}
              >
                {tool.name}
              </EnhancedLandingCard>
            ))}
          </div>

          {/* No Results Message */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16 animate-scaleIn">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-2">No tools found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search terms or browse by category
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 transform"
              >
                Show All Tools
              </button>
            </div>
          )}
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Call to Action Section */}
        <section className="w-full max-w-4xl mx-auto px-4 py-16 text-center animate-fadeIn">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 animate-slideUp">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-slideUp animation-delay-200">
            Choose any tool above and start being more productive today. No sign-up required!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slideUp animation-delay-400">
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:scale-105 transform"
            >
              Browse All Tools
            </button>
            <a
              href="#features"
              className="px-8 py-4 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-white rounded-full font-semibold transition-all duration-300 hover:scale-105 transform"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Spacer for footer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
