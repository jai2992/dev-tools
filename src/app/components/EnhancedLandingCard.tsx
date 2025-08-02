"use client";
import React from "react";

interface EnhancedLandingCardProps {
  children: React.ReactNode;
  href: string;
  icon?: string;
  category?: string;
  description?: string;
  delay?: number;
}

export default function EnhancedLandingCard({ 
  children, 
  href, 
  icon, 
  category, 
  description, 
  delay = 0 
}: EnhancedLandingCardProps) {
  return (
    <a
      href={href}
      className="group block animate-scaleIn"
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: 'both'
      }}
    >
      <div className="relative h-full bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-lg group-hover:shadow-blue-500/10 overflow-hidden group-hover:scale-105 transform">
        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {category && (
            <span className="text-xs font-medium text-blue-400 mb-2 uppercase tracking-wider">
              {category}
            </span>
          )}
          
          <div className="flex items-center gap-3 mb-3">
            {icon && (
              <span className="text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
                {icon}
              </span>
            )}
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
              {children}
            </h3>
          </div>
          
          {description && (
            <p className="text-gray-400 text-sm flex-1 group-hover:text-gray-300 transition-colors">
              {description}
            </p>
          )}
          
          {/* Hover arrow */}
          <div className="flex items-center justify-end mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
        
        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
    </a>
  );
}
