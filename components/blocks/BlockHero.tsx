export function BlockHero() {
  return (
    <>
      {/* Scroll Progress Indicator */}

      {/* Hero Section */}
      <section id="hero" className="py-6 pb-16 border-b border-border mb-0">
        <div className="max-w-4xl mx-auto px-8">
          <h2
            className="mb-6 max-w-3xl"
            style={{
              fontFamily: "IBM Plex Sans, sans-serif",
              lineHeight: "1.3",
            }}
          >
            Перетворення фрагментів на записи: матеріал, ризик, повторне
            використання та рефлексія
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Дані зібрані під час воркшопу з аналізу будівельного сміття. Кожен
            зразок документує процес класифікації матеріалів, оцінки ризиків та
            визначення можливостей повторного використання.
          </p>
        </div>
      </section>
    </>
  );
}
