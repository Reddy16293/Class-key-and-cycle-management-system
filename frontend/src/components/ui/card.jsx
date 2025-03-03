import React from "react";

const card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export { card };