import React, { ButtonHTMLAttributes } from "react";

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className = "",
  ...props
}) => (
  <button
    className={`rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 disabled:opacity-50 ${className}`}
    {...props}
  />
);
export default Button;
