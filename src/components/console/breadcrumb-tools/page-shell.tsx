import { ReactNode } from "react";
import PageShellMotion from "./page-shell-motion";

import QuickActions from "./quick-actions";
// import CommandPaletteShell from "./command-palette-shell"

interface Props {
  children: ReactNode;
  header?: ReactNode;

  enablePalette?: boolean;
  quickActions?: { label: string; onClick: () => void }[];

  maxWidth?: string;
  padded?: boolean;
}

export default function PageShell({
  children,
  header,
  enablePalette = true,
  quickActions,
  maxWidth = "max-w-[1600px]",
  padded = true,
}: Props) {
  return (
    <main className="flex-1 min-h-screen bg-[#f8fafc] overflow-y-auto border border-gray-100">
      {/* {enablePalette && <CommandPaletteShell />} */}

      {header}

      <PageShellMotion maxWidth={maxWidth} padded={padded}>
        {children}
      </PageShellMotion>

      {quickActions && <QuickActions actions={quickActions} />}
    </main>
  );
}
