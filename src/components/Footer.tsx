import { business } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-6 py-10 text-xs uppercase tracking-[0.15em] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {business.name} · {business.location}
        </p>
        <div className="flex gap-6">
          <a href={business.phoneHref} className="transition hover:text-foreground">
            Sími {business.phone}
          </a>
          <a href={business.smsHref} className="transition hover:text-foreground">
            Senda SMS
          </a>
        </div>
      </div>
    </footer>
  );
}
