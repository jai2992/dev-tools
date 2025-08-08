'use client';

type ButtonProps = {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles = {
  primary: [
    "bg-white text-black border-white",
    "hover:bg-gray-50 hover:shadow-md hover-lift",
    "active:bg-gray-100 active-scale",
    "focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none"
  ].join(" "),
  secondary: [
    "bg-transparent text-white border-white border-opacity-30",
    "hover:bg-white hover:bg-opacity-10 hover:border-opacity-50 hover-lift",
    "active:bg-white active:bg-opacity-20 active-scale",
    "focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-30 focus:outline-none"
  ].join(" "),
  ghost: [
    "bg-transparent text-white border-transparent",
    "hover:bg-white hover:bg-opacity-5 hover-lift",
    "active:bg-white active:bg-opacity-10 active-scale",
    "focus:shadow-glow focus:ring-2 focus:ring-white focus:ring-opacity-20 focus:outline-none"
  ].join(" "),
  danger: [
    "bg-red-600 text-white border-red-600",
    "hover:bg-red-700 hover:border-red-700 hover:shadow-md hover-lift",
    "active:bg-red-800 active:border-red-800 active-scale",
    "focus:shadow-glow focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 focus:outline-none"
  ].join(" ")
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm min-h-[32px]",
  md: "px-4 py-2 text-base min-h-[40px]",
  lg: "px-6 py-3 text-lg min-h-[48px]"
};

export default function Button({ 
  variant = "primary", 
  size = "md",
  children, 
  className = "", 
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium text-center
        border rounded-lg select-none
        transition-all duration-200 ease-out
        click-ripple
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
