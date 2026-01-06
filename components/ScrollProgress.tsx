"use client";
import { useEffect, useState } from "react";

const sections = [
  { id: "hero", label: "Вступ" },
  { id: "block-general", label: "Загальні" },
  { id: "block-fractions", label: "Фракції" },
  { id: "block-materials", label: "Матеріали" },
  { id: "block-voting", label: "Рефлексії" },
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
          className="group flex flex-row-reverse items-center gap-2"
        >
          {/* Indicator – fixed column */}
          <div
            className={`h-1 transition-all ${
              activeSection === section.id
                ? "bg-foreground w-6"
                : "bg-muted w-1 group-hover:bg-muted-foreground"
            }`}
          />

          {/* Label – right-aligned, grows left */}
          <span
            className="
            w-40
            text-right
            text-[10px]
            text-muted-foreground
            opacity-0
            group-hover:opacity-100
            transition-opacity
            uppercase
            tracking-wider
            font-mono
            whitespace-nowrap
          "
          >
            {section.label}
          </span>
        </button>
      ))}
    </div>
  );
}
