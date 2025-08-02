"use client";
import React, { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search tools..." }: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 animate-slideUp animation-delay-200">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center transition-transform duration-300 ${
          isExpanded ? 'scale-102' : 'scale-100'
        }`}>
          <div className="absolute left-4 z-10">
            <svg
              className="w-5 h-5 text-gray-400 hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
          
          {query && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-4 z-10 p-1 text-gray-400 hover:text-white transition-colors hover:scale-110 duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search suggestions backdrop */}
        <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl -z-10 transition-opacity duration-300 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`} />
      </form>
      
      {/* Search hint */}
      {!query && isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl text-sm text-gray-400 animate-slideDown">
          Try searching for: &quot;QR&quot;, &quot;PDF&quot;, &quot;Image&quot;, &quot;Code&quot;, &quot;JSON&quot;, etc.
        </div>
      )}
    </div>
  );
}
