import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

const CustomButton: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={cn(
        "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        {
          "bg-purple-700 text-white hover:bg-purple-800": variant === "default",
          "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100": variant === "outline",
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
          "bg-transparent text-purple-600 hover:underline p-0": variant === "link",
          "text-sm px-3 py-1": size === "sm",
          "px-5 py-2": size === "md",
          "text-lg px-6 py-3": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;