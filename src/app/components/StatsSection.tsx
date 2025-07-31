"use client";
import React from "react";

const stats = [
  {
    number: "50+",
    label: "Developer Tools",
    description: "Comprehensive toolkit for all your development needs"
  },
  {
    number: "100K+",
    label: "Monthly Users",
    description: "Trusted by developers worldwide"
  },
  {
    number: "1M+",
    label: "Files Processed",
    description: "Reliable processing power you can count on"
  },
  {
    number: "99.9%",
    label: "Uptime",
    description: "Always available when you need it"
  }
];

export default function StatsSection() {
  return (
    <section className="w-full bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-y border-gray-700/50 py-16 my-16 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 animate-slideUp">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Trusted by Developers Worldwide
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of developers who rely on our tools daily
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300 animate-scaleIn"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 animate-pulse">
                {stat.number}
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
