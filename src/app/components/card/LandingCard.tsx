import React from "react";
type CardProps = {
    children : React.ReactNode;
}

export default function LandingCard({children}:CardProps) {
  return (
    <div className="flex bg-white mt-5 mb-5 px-4 py-2 items-center justify-center rounded-2xl border-1 border-pink-500 text-pink-500 hover:bg-black hover:text-blue-500 transition-all duration-500 ease-in-out">
        {children}
    </div>
  )
}
