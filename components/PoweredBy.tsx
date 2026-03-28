import Image from "next/image";

type Brand = {
  name: string;
  href: string;
  /** Screen reader + tooltip */
  description: string;
} & (
  | { kind: "img"; src: string; width: number; height: number; className?: string }
  | { kind: "convexWordmark"; className?: string }
);

const brands: Brand[] = [
  {
    name: "Cursor",
    href: "https://cursor.com",
    description: "Cursor — AI code editor",
    kind: "img",
    src: "/logos/cursor.ico",
    width: 32,
    height: 32,
    className: "opacity-95 transition hover:opacity-100",
  },
  {
    name: "Convex",
    href: "https://www.convex.dev",
    description: "Convex — backend & real-time database",
    kind: "convexWordmark",
    className: "h-5 w-auto max-w-[120px] md:max-w-[140px]",
  },
  {
    name: "OpenAI",
    href: "https://openai.com",
    description: "OpenAI — AI models",
    kind: "img",
    src: "/logos/openai.svg",
    width: 28,
    height: 28,
    className: "h-7 w-7 opacity-90 transition hover:opacity-100",
  },
];

function BrandMark({ brand }: { brand: Brand }) {
  if (brand.kind === "convexWordmark") {
    return (
      <span className="inline-flex items-center rounded-xl bg-[#0a0a0a] px-3 py-2 ring-1 ring-white/10">
        <Image
          src="/logos/convex.svg"
          alt=""
          width={112}
          height={21}
          className={brand.className}
        />
      </span>
    );
  }

  return (
    <Image
      src={brand.src}
      alt=""
      width={brand.width}
      height={brand.height}
      className={brand.className}
    />
  );
}

/**
 * Attribution row with official-style marks. Convex wordmark is shown on a dark
 * chip because the asset from convex.dev uses white fills.
 */
export function PoweredBy() {
  return (
    <footer className="mt-auto border-t border-brand-mist/25 bg-white/60 py-10 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
          Powered by
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {brands.map((brand) => (
            <li key={brand.name}>
              <a
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                title={brand.description}
                className="group flex flex-col items-center gap-2 outline-none ring-brand-navy/20 focus-visible:ring-2"
              >
                <BrandMark brand={brand} />
                <span className="text-xs font-bold text-slate-600 underline-offset-4 group-hover:underline">
                  {brand.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs font-semibold leading-relaxed text-slate-500">
          ScholarShip AI uses Convex for data &amp; APIs, OpenAI for matching,
          Exa for web search context, Cursor for building, and Next.js for the
          web app. Names and logos belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
