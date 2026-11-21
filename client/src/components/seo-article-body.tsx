import type { SeoArticle, SeoImage } from "@shared/seo-article";

function Figure({ img, priority }: { img: SeoImage; priority?: boolean }) {
  return (
    <figure className="my-4 rounded-xl overflow-hidden border border-border">
      <img
        src={img.src}
        alt={img.alt}
        title={img.alt}
        className="w-full h-44 object-cover"
        width={800}
        height={450}
        loading={priority ? "eager" : "lazy"}
        {...(priority ? { fetchPriority: "high" as const } : {})}
      />
      <figcaption className="text-[10px] text-muted-foreground text-center py-1.5 bg-muted/30 px-2">
        {img.alt}
      </figcaption>
    </figure>
  );
}

export default function SeoArticleBody({
  article,
  testId,
}: {
  article: SeoArticle;
  testId?: string;
}) {
  const n = article.sections.length;
  const slots = Array.from(new Set([0, Math.floor(n / 3), Math.floor((2 * n) / 3)]));
  return (
    <article className="space-y-5" data-testid={testId}>
      {article.sections.map((sec, i) => {
        const imgIdx = slots.indexOf(i);
        const img = imgIdx >= 0 ? article.images[imgIdx] : undefined;
        return (
          <section key={i}>
            {img && i === 0 && <Figure img={img} priority />}
            <h2 className="text-base font-bold text-foreground mb-2 leading-snug">{sec.heading}</h2>
            {sec.paragraphs.map((p, j) => (
              <p key={j} className="text-sm text-foreground/90 leading-relaxed mb-3">
                {p}
              </p>
            ))}
            {img && i !== 0 && <Figure img={img} />}
          </section>
        );
      })}
    </article>
  );
}
