import * as React from "react";

interface MasonryLayoutProps {
  readonly children: React.ReactNode;
}

/** Provides a responsive CSS masonry layout for gallery cards. */
export function MasonryLayout({ children }: MasonryLayoutProps): React.ReactElement {
  return (
    <div className="columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
      {children}
    </div>
  );
}
