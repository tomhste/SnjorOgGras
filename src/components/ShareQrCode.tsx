"use client";

import { QRCodeSVG } from "qrcode.react";
import { business } from "@/lib/content";

/**
 * A scannable QR code pointing at the site's own URL — handy for the
 * owners to print on flyers or show someone's phone camera in person so
 * they land straight on this site. Uses a high error-correction level so
 * it still scans reliably if printed small or slightly smudged.
 */
export function ShareQrCode() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
      <div className="shrink-0 rounded-xl bg-white p-2">
        <QRCodeSVG
          value={business.siteUrl}
          size={72}
          level="H"
          marginSize={0}
          fgColor="#16181a"
          bgColor="#ffffff"
          title={`QR kóði á ${business.siteUrl}`}
        />
      </div>
      <div className="text-left">
        <p className="font-[family-name:var(--font-display)] text-base italic">
          Deildu síðunni
        </p>
        <p className="mt-1 text-xs text-muted">
          Skannaðu til að opna {business.siteUrl.replace("https://", "")}
        </p>
      </div>
    </div>
  );
}
