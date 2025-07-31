"use client";
import React from "react";

const features = [
  {
    icon: "🚀",
    title: "Lightning Fast",
    description: "All tools run locally in your browser for instant results"
  },
  {
    icon: "🔒",
    title: "100% Private",
    description: "Your files never leave your device - complete privacy guaranteed"
  },
  {
    icon: "💰",
    title: "Completely Free",
    description: "No subscriptions, no limits, no hidden costs - forever free"
  },
  {
    icon: "📱",
    title: "Mobile Friendly",
    description: "Works perfectly on desktop, tablet, and mobile devices"
  },
  {
    icon: "🎯",
    title: "No Sign-up Required",
    description: "Start using any tool immediately - no accounts needed"
  },
  {
    icon: "🔄",
    title: "Always Updated",
    description: "Regular updates with new tools and improvements"
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full max-w-6xl mx-auto px-4 py-16 animate-fadeIn">
      <div className="text-center mb-12 animate-slideUp">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Why Choose DevTools.Software?
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Built for developers, by developers. Experience the perfect blend of power and simplicity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 animate-scaleIn"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
            
            {/* Hover border effect */}
            <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}
