import { business } from "@/lib/content";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-[family-name:var(--font-display)] text-xl italic">
          {business.name}
        </span>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-muted sm:flex">
          <a href="#thjonusta" className="transition hover:text-foreground">
            Þjónusta
          </a>
          <a href="#stjornendur" className="transition hover:text-foreground">
            Hverjir erum við
          </a>
          <a href="#tilbod" className="transition hover:text-foreground">
            Fá tilboð
          </a>
        </nav>
        <a
          href={business.phoneHref}
          className="text-xs font-semibold uppercase tracking-[0.15em] underline decoration-accent decoration-2 underline-offset-4 transition hover:text-accent"
        >
          Hringja
        </a>
      </div>
    </header>
  );
}
