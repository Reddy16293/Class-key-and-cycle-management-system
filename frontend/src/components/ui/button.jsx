import React from "react";

const button = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "px-4 py-2 font-semibold rounded-md transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export { button };
