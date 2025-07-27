type ButtonProps = {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-500 hover:ring-2 hover:ring-blue-600",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
};

export default function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
