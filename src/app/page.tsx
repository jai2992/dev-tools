"use client";
import React, { useState, useMemo } from "react";
import Hero from "./components/Hero";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import ToolCard from "../components/common/ToolCard";
import FeaturesSection from "./components/FeaturesSection";
import StatsSection from "./components/StatsSection";
import Button from "../components/common/Button";
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
              <ToolCard
                key={tool.id}
                title={tool.name}
                description={tool.description}
                href={tool.href}
                icon={<span className="text-2xl">{tool.icon}</span>}
                category={tool.category}
                variant="default"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              />
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
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Show All Tools
              </Button>
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
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                document.querySelector('.grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4"
            >
              Browse All Tools
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-8 py-4"
            >
              Learn More
            </Button>
          </div>
        </section>

        {/* Spacer for footer */}
        <div className="h-20" />
      </div>
    </div>
  );
}
