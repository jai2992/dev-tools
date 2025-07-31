"use client";
import React from "react";

export default function Hero() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-spin" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full blur-xl animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-green-500/10 to-yellow-500/10 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 animate-fadeIn">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 animate-slideUp">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            DEVTOOLS
          </span>
          <span className="text-white">.SOFTWARE</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-300 mb-4 max-w-4xl mx-auto animate-slideUp animation-delay-200">
          Your One-Stop Free Toolkit for Modern Developers & Document Processing!
        </p>
        
        <p className="text-sm sm:text-lg text-gray-400 mb-8 max-w-2xl mx-auto animate-slideUp animation-delay-400">
          Code tools, document converters, image processors, and more - all for free with no sign-up required!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-8 animate-slideUp animation-delay-600">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">50+</div>
            <div className="text-xs sm:text-sm text-gray-400">Tools</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">100%</div>
            <div className="text-xs sm:text-sm text-gray-400">Free</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-pink-400">0</div>
            <div className="text-xs sm:text-sm text-gray-400">Sign-ups</div>
          </div>
        </div>
      </div>
    </div>
  );
}
