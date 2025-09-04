import React, { forwardRef } from "react";

interface MagazinePageProps {
  children: React.ReactNode;
  className?: string;
}

export const MagazinePage = forwardRef<HTMLDivElement, MagazinePageProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          w-full h-full bg-white rounded-lg shadow-elegant overflow-hidden
          ${className}
        `}
      >
        {children}
      </div>
    );
  }
);

MagazinePage.displayName = "MagazinePage";