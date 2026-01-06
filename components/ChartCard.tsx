import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  legend?: ReactNode;
}

export function ChartCard({ title, children, legend }: ChartCardProps) {
  return (
    <div className="border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm text-foreground uppercase tracking-wide font-mono">
          {title}
        </h3>
      </div>
      <div className="p-4 min-h-[280px]">{children}</div>
      {legend && (
        <div className="px-4 pb-3 pt-2 border-t border-border text-xs">
          {legend}
        </div>
      )}
    </div>
  );
}
