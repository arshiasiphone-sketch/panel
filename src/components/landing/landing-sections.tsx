/**
 * Landing page section renderers.
 * These reuse the EXACT same JSX/animations from the original hardcoded landing
 * page; only their data flows from page_blocks settings + shared CMS context.
 */
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, memo } from "react";
import type { MenuItem, GalleryImage, EventItem, Testimonial, SiteContentMap } from "@/lib/cms";
import { normalizeBlockType } from "@/components/admin/blocks";

export type LandingCtx = {
  menu: MenuItem[];
  gallery: GalleryImage[];
  events: EventItem[];
  testimonials: Testimonial[];
  site: SiteContentMap | undefined;
};

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

const HOW_STEPS_DEFAULT = [
  { n: "۱", title: "تست رو شروع کن", desc: "روی دکمه بزن و وارد مسیر کشف شخصیت کافه‌ای‌ات شو.", d: "M5 12h14M13 6l6 6-6 6" },
  { n: "۲", title: "به ۱۱ سوال جواب بده", desc: "سوال‌های کوتاه و ساده درباره‌ی سلیقه و حال‌وهوای تو.", d: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
  { n: "۳", title: "نتیجه‌ات رو ببین", desc: "تیپ شخصیتی، نوشیدنی پیشنهادی و بهترین جای نشستنت رو کشف کن.", d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6" },
];

const CupSvg = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
    <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
  </svg>
);

function SectionHeading({ kicker, title, subtitle }: { kicker?: string; title?: string; subtitle?: string }) {
  if (!kicker && !title && !subtitle) return null;
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center gap-3 text-center">
      {kicker && <span className="text-[11px] font-bold uppercase text-accent" style={{ letterSpacing: "0.28em" }}>{kicker}</span>}
      {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-balance text-foreground">{title}</h2>}
      {subtitle && <p className="text-sm max-w-md text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}

/* ─────────────── Hero ─────────────── */
function HeroSection({ s, ctx }: { s: Record<string, unknown>; ctx: LandingCtx }) {
  const siteHero = (ctx.site?.hero ?? {}) as Record<string, string | undefined>;
  const title = String(s.title ?? siteHero.title ?? "شخصیت کافه‌ای‌ات\nرو کشف کن");
  const subtitle = s.subtitle ?? siteHero.subtitle;
  const badge = s.badge ?? siteHero.badge;
  const ctaText = String(s.cta_text ?? siteHero.cta_text ?? "شروع تست");
  const heroLines = title.split("\n");
  return (
    <section className="relative flex flex-col items-center justify-center px-5 pt-24 pb-16 text-center min-h-[92vh]">
      <div className="relative w-full max-w-lg flex flex-col items-center gap-9">
        <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col items-center gap-3">
          <div className="w-[78px] h-[78px] rounded-[22px] flex items-center justify-center"
            style={{ background: "rgba(159,18,57,0.12)", border: "1px solid rgba(159,18,57,0.32)", backdropFilter: "blur(16px)", boxShadow: "0 0 48px rgba(159,18,57,0.2), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            <CupSvg />
          </div>
          {badge && <span className="text-[10px] font-bold uppercase text-accent" style={{ letterSpacing: "0.32em" }}>{badge}</span>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-5">
          <h1 className="text-[2.6rem] sm:text-[3.2rem] font-extrabold leading-[1.18] text-balance text-foreground">
            {heroLines.map((l, i) => <span key={i}>{l}{i < heroLines.length - 1 && <br />}</span>)}
          </h1>
          {subtitle && (
            <p className="text-base leading-[1.9] text-pretty mx-auto max-w-md text-muted-foreground">{String(subtitle)}</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.45 }} className="w-full max-w-xs">
          <Link to={(s.cta_url as string) ?? "/test/info"} className="block w-full">
            <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
              className="relative block w-full py-[18px] rounded-2xl text-lg font-extrabold text-center cursor-pointer select-none overflow-hidden text-foreground"
              style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 55%, #d4af37 160%)", boxShadow: "0 10px 44px rgba(159,18,57,0.5), inset 0 1px 0 rgba(255,255,255,0.14)" }}>
              <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)" }}
                animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }} />
              <span className="relative z-10">{ctaText}</span>
            </motion.span>
          </Link>
          {s.note !== "" && <p className="mt-3 text-xs text-text-tertiary">{s.note ?? "رایگان · بدون ثبت‌نام · کمتر از ۳ دقیقه"}</p>}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── Parallax Gallery ─────────────── */
function ParallaxCard({ image, container, index }: { image: GalleryImage; container: React.RefObject<HTMLDivElement | null>; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container, target: cardRef, axis: "x", offset: ["start end", "end start"] });
  const imgX = useTransform(scrollXProgress, [0, 1], ["-18%", "18%"]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.94, 1.04, 0.94]);
  const opacity = useTransform(scrollXProgress, [0, 0.5, 1], [0.55, 1, 0.55]);
  return (
    <motion.div ref={cardRef} style={{ scale, opacity }} className="relative shrink-0 snap-center rounded-3xl overflow-hidden">
      <div className="relative w-[72vw] sm:w-[52vw] md:w-[42vw] lg:w-[32vw] aspect-[3/4]"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.18)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
        <motion.img src={image.image_url} alt={image.title || `gallery-${index + 1}`} loading="lazy" style={{ x: imgX }}
          className="absolute inset-0 w-[140%] h-full object-cover" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 p-5 text-right text-foreground"
          style={{ background: "linear-gradient(180deg, transparent 0%, rgba(13,10,14,0.85) 100%)" }} dir="rtl">
          {image.title && <p className="text-sm font-bold">{image.title}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function ParallaxGallerySection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (ctx.gallery.length === 0) return null;
  return (
    <section className="relative py-20">
      <div className="max-w-5xl mx-auto px-5 flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
      </div>
      <div ref={scrollRef} dir="ltr"
        className="mt-8 flex gap-5 overflow-x-auto overflow-y-hidden snap-x snap-mandatory px-[10vw] pb-6"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        <style>{`.parallax-scroller::-webkit-scrollbar{display:none}`}</style>
        {ctx.gallery.map((img, i) => <ParallaxCard key={img.id} image={img} container={scrollRef} index={i} />)}
      </div>
    </section>
  );
}

/* ─────────────── Menu Highlights ─────────────── */
function MenuHighlightsSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const count = Number(s.count ?? 4);
  const items = ctx.menu.slice(0, count);
  if (items.length === 0) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="relative aspect-square" style={{ background: "rgba(0,0,0,0.3)" }}>
                {item.image_url && <img src={item.image_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="p-4 flex flex-col gap-1.5 text-right">
                <span className="text-[10px] font-bold text-accent">{item.category}</span>
                <span className="text-sm font-bold text-foreground">{item.name}</span>
                {s.show_prices !== false && item.price && <span className="text-xs font-bold text-muted-foreground">{item.price}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── How It Works ─────────────── */
function HowItWorksSection({ s }: { s: any }) {
  const steps = Array.isArray(s.steps) && s.steps.length ? s.steps : HOW_STEPS_DEFAULT;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((step: any, i: number) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl p-6 flex flex-col gap-4 text-right"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d={step.d ?? HOW_STEPS_DEFAULT[i % 3].d} /></svg>
                </div>
                <span className="text-4xl font-extrabold" style={{ color: "rgba(159,18,57,0.45)" }}>{step.n}</span>
              </div>
              <h3 className="text-base font-bold text-foreground">{step.title}</h3>
              <p className="text-sm leading-[1.8] text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Gallery Preview ─────────────── */
function GalleryPreviewSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const count = Number(s.count ?? 6);
  const columns = Number(s.columns ?? 6);
  const images = ctx.gallery.slice(0, count);
  if (images.length === 0) return null;
  const cols: Record<number, string> = { 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" };
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className={`grid grid-cols-3 ${cols[columns] ?? "md:grid-cols-6"} gap-2.5`}>
          {images.map((img, i) => (
            <motion.div key={img.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
              <img src={img.image_url} alt={img.title || "تصویر کافه"} className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Events Preview ─────────────── */
function EventsPreviewSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const count = Number(s.count ?? 2);
  const items = ctx.events.slice(0, count);
  if (items.length === 0) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((ev, i) => (
            <motion.article key={ev.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="relative h-44" style={{ background: "rgba(0,0,0,0.3)" }}>
                {ev.image_url && <img src={ev.image_url} alt={ev.title} className="absolute inset-0 w-full h-full object-cover" />}
              </div>
              <div className="p-5 flex flex-col gap-2 text-right">
                {ev.date_label && <span className="text-xs font-bold text-accent">{ev.date_label}</span>}
                <h3 className="text-lg font-extrabold text-foreground">{ev.title}</h3>
                {ev.description && <p className="text-sm leading-[1.8] text-muted-foreground">{ev.description}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Location ─────────────── */
function LocationSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const contact = (ctx.site?.contact ?? {}) as { address?: string; phone?: string; hours?: string };
  const social = (ctx.site?.social ?? {}) as { instagram?: string };
  const address = (s.address as string) ?? contact.address;
  const hours = (s.hours as string) ?? contact.hours;
  const phone = (s.phone as string) ?? contact.phone;
  const instagram = (s.instagram as string) ?? social.instagram;
  if (!address && !phone && !hours && !instagram) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-7 text-right"
          style={{ background: "rgba(159,18,57,0.07)", border: "1px solid rgba(159,18,57,0.2)", backdropFilter: "blur(14px)" }}>
          <div className="flex-1 flex flex-col gap-3">
            {s.kicker && <span className="text-[11px] font-bold uppercase text-accent" style={{ letterSpacing: "0.22em" }}>{s.kicker}</span>}
            {s.title && <h3 className="text-2xl font-extrabold text-foreground">{s.title}</h3>}
            {address && <p className="text-sm leading-[1.9] text-muted-foreground">{address}</p>}
            {hours && <p className="text-sm text-text-tertiary">{hours}</p>}
            {phone && <p className="text-sm text-text-tertiary" dir="ltr">{phone}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 text-foreground" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  اینستاگرام
                </a>
              )}
            </div>
          </div>
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(159,18,57,0.12)", border: "1px solid rgba(159,18,57,0.3)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── Stats ─────────────── */
function StatsSection({ s }: { s: any }) {
  const items: Array<{ value: string; label: string }> = Array.isArray(s.items) ? s.items : [];
  if (items.length === 0) return null;
  return (
    <section className="relative px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto rounded-3xl px-6 py-10"
        style={{ background: "rgba(159,18,57,0.06)", border: "1px solid rgba(159,18,57,0.18)", backdropFilter: "blur(14px)" }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 text-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-accent">{item.value}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────── Testimonials ─────────────── */
function TestimonialsSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  if (ctx.testimonials.length === 0) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ctx.testimonials.map((t, i) => (
            <motion.figure key={t.id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl p-6 flex flex-col gap-4 text-right"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="rgba(212,175,55,0.3)" aria-hidden="true">
                <path d="M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" />
              </svg>
              <blockquote className="text-sm leading-[1.85] text-text-tertiary">{t.text}</blockquote>
              <figcaption className="flex items-center gap-2 pt-1">
                <span className="text-sm font-bold text-foreground">{t.name}</span>
                {t.type && <span className="text-xs px-2 py-0.5 rounded-full text-accent" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>{t.type}</span>}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Generic / utility blocks ─────────────── */
function SpacerSection({ s }: { s: any }) {
  return <div style={{ height: `${Number(s.height ?? 60)}px` }} />;
}
function DividerSection({ s }: { s: any }) {
  if (s.style === "space") return <div className="h-12" />;
  return (
    <div className="relative px-5 py-6 max-w-3xl mx-auto">
      <div style={{ borderTop: s.style === "dots" ? "2px dotted rgba(212,175,55,0.3)" : "1px solid rgba(212,175,55,0.25)" }} />
    </div>
  );
}
function RichTextSection({ s }: { s: any }) {
  return (
    <section className="relative px-5 py-12">
      <div className="max-w-2xl mx-auto text-center" dir="rtl">
        {s.title && <h3 className="text-xl font-extrabold mb-3 text-foreground">{s.title}</h3>}
        {s.text && <p className="text-sm leading-[1.95] whitespace-pre-wrap text-text-tertiary">{s.text}</p>}
      </div>
    </section>
  );
}
function ImageBlockSection({ s }: { s: any }) {
  if (!s.url) return null;
  return (
    <section className="relative px-5 py-10">
      <div className="max-w-4xl mx-auto">
        <img src={s.url} alt={s.caption ?? ""} className="w-full rounded-3xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }} />
        {s.caption && <p className="text-xs text-center mt-3 text-muted-foreground">{s.caption}</p>}
      </div>
    </section>
  );
}
function VideoBlockSection({ s }: { s: any }) {
  if (!s.url) return null;
  return (
    <section className="relative px-5 py-10">
      <div className="max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        <iframe src={s.url} className="w-full h-full" allowFullScreen title={s.title ?? "video"} />
      </div>
    </section>
  );
}
function CustomHtmlSection({ s }: { s: any }) {
  if (!s.html) return null;
  return (
    <section className="relative px-5 py-10">
      <div className="max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: String(s.html) }} />
    </section>
  );
}

function ParagraphSection({ s }: { s: any }) {
  if (!s.text) return null;
  return (
    <section className="relative px-5 py-8">
      <p className="max-w-2xl mx-auto text-sm leading-[1.95] whitespace-pre-wrap text-center text-text-tertiary">{s.text}</p>
    </section>
  );
}

function ButtonSection({ s }: { s: any }) {
  if (!s.label) return null;
  const href = s.url || "#";
  return (
    <section className="relative px-5 py-8 text-center">
      <a href={href}
        className="inline-block px-8 py-3.5 rounded-2xl text-sm font-bold text-foreground"
        style={s.style === "outline"
          ? { border: "1px solid rgba(255,255,255,0.2)", background: "transparent" }
          : s.style === "secondary"
            ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
            : { background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)", boxShadow: "0 8px 32px rgba(159,18,57,0.35)" }}>
        {s.label}
      </a>
    </section>
  );
}

function MenuSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const fromBlock = Array.isArray(s.items) ? s.items.filter((it: { name?: string }) => it?.name) : [];
  const items = fromBlock.length
    ? fromBlock
    : ctx.menu.map((m) => ({ name: m.name, price: m.price }));
  if (items.length === 0) return null;
  return (
    <section className="relative px-5 py-16">
      <div className="max-w-lg mx-auto rounded-3xl p-6 text-right"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {s.title && <h3 className="text-lg font-bold mb-4 text-foreground">{s.title}</h3>}
        <ul className="text-sm divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {items.map((it: { name: string; price?: string }, i: number) => (
            <li key={i} className="flex justify-between py-2.5 gap-3">
              <span className="text-foreground">{it.name}</span>
              {it.price && <span className="text-muted-foreground">{it.price}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function GalleryStaticSection({ s }: { s: any }) {
  const images: string[] = Array.isArray(s.images) ? s.images.filter(Boolean) : [];
  if (images.length === 0) return null;
  return (
    <section className="relative px-5 py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-2.5">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection({ s }: { s: any }) {
  const items: Array<{ q: string; a: string }> = Array.isArray(s.items) ? s.items : [];
  if (items.length === 0) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <SectionHeading kicker={s.kicker} title={s.title ?? "سوالات متداول"} />
        <div className="flex flex-col gap-3">
          {items.map((it, i) => (
            <details key={i} className="rounded-2xl p-4 text-right" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <summary className="cursor-pointer text-sm font-bold text-foreground">{it.q}</summary>
              <p className="text-sm mt-3 leading-[1.9] text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
function InstagramSection({ s }: { s: any }) {
  if (!s.handle) return null;
  return (
    <section className="relative px-5 py-10 text-center">
      <a href={`https://instagram.com/${String(s.handle).replace("@", "")}`} target="_blank" rel="noopener noreferrer"
        className="inline-block px-6 py-3 rounded-2xl text-sm font-bold text-accent" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }}>
        {s.handle} در اینستاگرام
      </a>
    </section>
  );
}
function PersonalityTypesSection({ s }: { s: any }) {
  const items: Array<{ label: string; tagline?: string; color?: string }> = Array.isArray(s.items) ? s.items : [
    { label: "آرام", tagline: "گوشه‌نشین", color: "#d4af37" },
    { label: "اجتماعی", tagline: "پر انرژی", color: "#9f1239" },
    { label: "خلاق", tagline: "ذهن باز", color: "#be123c" },
    { label: "متفکر", tagline: "عمیق", color: "#c9b89e" },
  ];
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker ?? "تیپ‌ها"} title={s.title ?? "چهار شخصیت کافه‌ای"} subtitle={s.subtitle} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl p-6 flex flex-col items-center gap-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="w-14 h-14 rounded-2xl" style={{ background: p.color ?? "#d4af37", opacity: 0.85 }} />
              <h3 className="text-base font-bold text-foreground">{p.label}</h3>
              {p.tagline && <p className="text-xs text-muted-foreground">{p.tagline}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Dispatcher ─────────────── */
export const LANDING_BLOCK_TYPES = [
  "hero", "personality_types", "how_it_works", "menu_highlights", "parallax_gallery",
  "gallery_preview", "gallery", "events_preview", "testimonials_section", "location", "stats",
  "faq", "instagram", "spacer", "divider", "rich_text", "paragraph", "button", "menu",
  "image", "video", "custom_html",
] as const;
export type LandingBlockType = (typeof LANDING_BLOCK_TYPES)[number];

function dispatch(type: string, settings: any, ctx: LandingCtx): React.ReactNode {
  switch (normalizeBlockType(type)) {
    case "hero": return <HeroSection s={settings} ctx={ctx} />;
    case "personality_types": return <PersonalityTypesSection s={settings} />;
    case "how_it_works": return <HowItWorksSection s={settings} />;
    case "menu_highlights": return <MenuHighlightsSection s={settings} ctx={ctx} />;
    case "menu": return <MenuSection s={settings} ctx={ctx} />;
    case "parallax_gallery": return <ParallaxGallerySection s={settings} ctx={ctx} />;
    case "gallery_preview": return <GalleryPreviewSection s={settings} ctx={ctx} />;
    case "gallery": return Array.isArray(settings.images) && settings.images.length
      ? <GalleryStaticSection s={settings} />
      : <GalleryPreviewSection s={settings} ctx={ctx} />;
    case "events_preview": return <EventsPreviewSection s={settings} ctx={ctx} />;
    case "testimonials_section": return <TestimonialsSection s={settings} ctx={ctx} />;
    case "location": return <LocationSection s={settings} ctx={ctx} />;
    case "stats": return <StatsSection s={settings} />;
    case "faq": return <FaqSection s={settings} />;
    case "instagram": return <InstagramSection s={settings} />;
    case "spacer": return <SpacerSection s={settings} />;
    case "divider": return <DividerSection s={settings} />;
    case "rich_text": return <RichTextSection s={settings} />;
    case "paragraph": return <ParagraphSection s={settings} />;
    case "button": return <ButtonSection s={settings} />;
    case "image": return <ImageBlockSection s={settings} />;
    case "video": return <VideoBlockSection s={settings} />;
    case "custom_html": return <CustomHtmlSection s={settings} />;
    default: return null;
  }
}

export const LandingBlockRender = memo(function LandingBlockRender({
  type, settings, ctx,
}: { type: string; settings: Record<string, unknown>; ctx: LandingCtx }) {
  return <>{dispatch(type, settings, ctx)}</>;
});
