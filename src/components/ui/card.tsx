import React, { ReactNode } from "react";

export const Card: React.FC<{ className?: string; children: ReactNode }> = ({
  className = "",
  children
}) => (
  <div
    className={`rounded-xl shadow bg-white dark:bg-gray-800 ${className}`}
  >
    {children}
  </div>
);

export const CardContent: React.FC<{ className?: string; children: ReactNode }> =
  ({ className = "", children }) => (
    <div className={`p-6 ${className}`}>{children}</div>
  );

export default Card;
