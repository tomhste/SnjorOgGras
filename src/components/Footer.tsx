import { business } from "@/lib/content";
import { ShareQrCode } from "@/components/ShareQrCode";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-border px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.15em] text-muted">
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

        <ShareQrCode />
      </div>
    </footer>
  );
}
