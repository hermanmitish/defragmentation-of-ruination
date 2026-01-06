interface MetaCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

export function MetaCard({ label, value, unit, highlight }: MetaCardProps) {
  return (
    <div
      className={`border bg-card p-3 ${
        highlight ? "border-accent" : "border-border"
      }`}
    >
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1.5 font-mono">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={
            highlight ? "text-xl text-foreground" : "text-lg text-foreground"
          }
        >
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
