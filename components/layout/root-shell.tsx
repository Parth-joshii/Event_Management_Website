import type { ReactNode } from "react";

interface RootShellProps {
  readonly children: ReactNode;
}

/** Provides the stable application shell around routed content. */
export function RootShell({ children }: RootShellProps): React.ReactElement {
  return <div className="relative min-h-dvh overflow-x-clip">{children}</div>;
}
