import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Вступ" },
  { id: "block-1", label: "Блок 1" },
  { id: "block-2", label: "Блок 2" },
  { id: "block-3", label: "Блок 3" },
];

export function ScrollProgress() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-10">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => {
            document
              .getElementById(section.id)
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group flex items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider font-mono">
            {section.label}
          </span>
          <div
            className={`w-1 h-1 transition-all ${
              activeSection === section.id
                ? "bg-foreground w-6 h-1"
                : "bg-muted hover:bg-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
