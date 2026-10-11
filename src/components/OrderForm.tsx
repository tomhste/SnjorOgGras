"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import confetti from "canvas-confetti";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { business } from "@/lib/content";
import { useMagnetic } from "@/lib/useMagnetic";

const schema = z.object({
  name: z.string().trim().min(1, "Vantar nafn").max(200),
  phone: z.string().trim().min(1, "Vantar símanúmer").max(50),
  service: z.enum(["snow", "grass", "other"]),
  area: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

function fireConfetti(origin: HTMLElement | null) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = origin?.getBoundingClientRect();
  const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
  const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.6;
  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 35,
    origin: { x, y },
    colors: ["#1f9d52", "#39ff8c", "#ffffff"],
  });
}

export function OrderForm() {
  const root = useRef<HTMLDivElement>(null);
  const [submitRef, submitHandlers] = useMagnetic<HTMLButtonElement>(0.2);
  const [status, setStatus] = useState<"idle" | "sent" | "error" | "offline">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { service: "snow" },
  });

  useGSAP(
    () => {
      // Deliberately not gated behind ScrollTrigger (unlike Services/Team):
      // this form is the main conversion point on the page, and a stale
      // ScrollTrigger position calculation (e.g. from web fonts or the
      // client-only hero photo slider loading late and shifting page
      // height) can leave ScrollTrigger-gated elements permanently stuck
      // at their initial opacity: 0 — see ScrollTriggerRefresh.tsx for the
      // general-purpose fix, but this element gets its own fromTo with no
      // scroll dependency at all, so it can never end up unusably invisible.
      gsap.fromTo(
        ".order-form-el",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    },
    { scope: root }
  );

  async function onSubmit(values: FormValues) {
    if (!isFirebaseConfigured || !db) {
      setStatus("offline");
      return;
    }
    const serviceLabel =
      values.service === "snow"
        ? "Snjómokstur"
        : values.service === "grass"
          ? "Garðsláttur"
          : "Annað";
    try {
      await addDoc(collection(db, "requests"), {
        name: values.name,
        phone: values.phone,
        service: values.service,
        area: values.area || "",
        message: values.message || "",
        createdAt: serverTimestamp(),
      });
      // Also drop a notification doc for the "Trigger Email" extension
      // (see README) so the owner gets an email the moment someone asks
      // for a quote, not just a row in Firestore.
      await addDoc(collection(db, "mail"), {
        to: [business.notifyEmail],
        message: {
          subject: `Ný beiðni: ${serviceLabel} frá ${values.name}`,
          text: [
            `Nafn: ${values.name}`,
            `Sími: ${values.phone}`,
            `Þjónusta: ${serviceLabel}`,
            values.area ? `Hverfi/heimilisfang: ${values.area}` : null,
            values.message ? `Skilaboð: ${values.message}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        },
        createdAt: serverTimestamp(),
      });
      setStatus("sent");
      reset({ name: "", phone: "", service: values.service, area: "", message: "" });
      fireConfetti(submitRef.current);
    } catch (err) {
      console.error("Failed to save request", err);
      setStatus("error");
    }
  }

  return (
    <section ref={root} id="tilbod" className="border-b border-border bg-background">
      <div className="mx-auto max-w-2xl px-6 py-20 sm:py-28">
        <span className="order-form-el text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Fá tilboð
        </span>
        <p className="order-form-el mt-4 font-[family-name:var(--font-display)] text-3xl italic sm:text-4xl">
          Sendu okkur línu.
        </p>
        <p className="order-form-el mt-4 max-w-md text-muted">
          Fylltu út eyðublaðið eða hringdu / sendu SMS í {business.phone}. Við
          svörum eins fljótt og við getum með tilboð sem fer eftir magni
          vinnu og stærð.
        </p>

        <form
          // react-hook-form's handleSubmit() only invokes onSubmit on an
          // actual submit event, never during render — the ref it closes
          // over (submitRef, for the confetti origin) is safe.
          // eslint-disable-next-line react-hooks/refs
          onSubmit={handleSubmit(onSubmit)}
          className="order-form-el mt-12 flex flex-col gap-7"
        >
          <div className="grid gap-7 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Nafn
              <input
                type="text"
                {...register("name")}
                className="border-b border-border bg-transparent py-2 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent"
                placeholder="Nafn þitt"
              />
              {errors.name && (
                <span className="text-xs font-normal normal-case tracking-normal text-red-500">
                  {errors.name.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              Símanúmer
              <input
                type="tel"
                {...register("phone")}
                className="border-b border-border bg-transparent py-2 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent"
                placeholder="8338568"
              />
              {errors.phone && (
                <span className="text-xs font-normal normal-case tracking-normal text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Þjónusta
            <select
              {...register("service")}
              className="border-b border-border bg-transparent py-2 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent"
            >
              <option value="snow">Snjómokstur</option>
              <option value="grass">Garðsláttur</option>
              <option value="other">Annað</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Hverfi / heimilisfang
            <input
              type="text"
              {...register("area")}
              className="border-b border-border bg-transparent py-2 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent"
              placeholder="Álftanes..."
            />
          </label>

          <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
            Skilaboð (valfrjálst)
            <textarea
              {...register("message")}
              rows={3}
              className="resize-none border-b border-border bg-transparent py-2 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent"
              placeholder="Stærð svæðis, hvenær hentar, o.s.frv."
            />
          </label>

          <button
            type="submit"
            ref={submitRef}
            onMouseMove={submitHandlers.onMouseMove}
            onMouseLeave={submitHandlers.onMouseLeave}
            disabled={isSubmitting}
            className="mt-4 inline-flex items-center justify-center self-start bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-contrast transition hover:brightness-110 disabled:opacity-60"
          >
            {isSubmitting ? "Sendi..." : "Senda beiðni"}
          </button>

          {status === "sent" && (
            <p className="bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
              Takk! Beiðnin var send — við höfum samband fljótlega.
            </p>
          )}
          {status === "error" && (
            <p className="bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
              Eitthvað fór úrskeiðis. Prófaðu aftur, eða hringdu í{" "}
              {business.phone}.
            </p>
          )}
          {status === "offline" && (
            <p className="bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-600">
              Vefsíðan er ekki enn tengd við gagnagrunn (Firebase). Hringdu
              eða sendu SMS í {business.phone} í staðinn.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
