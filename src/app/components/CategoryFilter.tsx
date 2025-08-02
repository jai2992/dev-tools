"use client";
import React from "react";

const categories = [
  { 
    id: "all", 
    name: "All Tools", 
    icon: "🛠️",
    description: "Browse all available tools"
  },
  { 
    id: "code", 
    name: "Code Development", 
    icon: "💻",
    description: "Code formatting, validation & generation"
  },
  { 
    id: "image", 
    name: "Image & Media", 
    icon: "🖼️",
    description: "Image processing & manipulation"
  },
  { 
    id: "document", 
    name: "Document Processing", 
    icon: "📄",
    description: "PDF, Word, Excel conversions"
  },
  { 
    id: "text", 
    name: "Text Processing", 
    icon: "📝",
    description: "Text utilities & converters"
  },
  { 
    id: "security", 
    name: "Security & Encoding", 
    icon: "🔒",
    description: "Encryption, hashing & encoding"
  },
];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 px-4 animate-slideUp animation-delay-400">
      <h2 className="text-2xl font-bold text-white mb-6 text-center animate-fadeIn animation-delay-600">
        Browse by Category
      </h2>
      
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative px-6 py-3 rounded-full border transition-all duration-300 group hover:scale-105 transform
              ${activeCategory === category.id
                ? 'bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-900/50 border-gray-700 text-gray-300 hover:border-blue-500/50 hover:text-blue-300'
              }
            `}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="flex items-center gap-2">
              <span className={`text-lg transition-transform duration-500 ${
                activeCategory === category.id ? 'animate-spin' : ''
              }`}>
                {category.icon}
              </span>
              <span className="font-medium">{category.name}</span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
              {category.description}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
            
            {/* Active indicator */}
            {activeCategory === category.id && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
