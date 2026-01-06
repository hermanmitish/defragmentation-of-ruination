import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  label: string;
  question: string;
  children: ReactNode;
}

export function SectionWrapper({
  id,
  label,
  question,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="py-12 border-b border-border">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8 pb-4 border-b border-border">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-mono">
            {label}
          </div>
          <h2
            className="text-foreground max-w-3xl"
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              lineHeight: "1.3",
            }}
          >
            {question}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
