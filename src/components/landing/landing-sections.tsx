/**
 * Landing page section renderers.
 * These reuse the EXACT same JSX/animations from the original hardcoded landing
 * page; only their data flows from page_blocks settings + shared CMS context.
 */
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, memo, useState, useEffect, useCallback } from "react";
import type { MenuItem, GalleryImage, EventItem, Testimonial, SiteContentMap } from "@/lib/cms";
import { normalizeBlockType } from "@/components/admin/blocks";
import { useIntersectionObserver } from "@/lib/lazy";
import { ImageSkeleton } from "@/components/ui/skeletons";

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
  const siteHero = (ctx.site?.hero ?? {}) as Record<string, unknown>;
  // Page-builder block.data wins; fall back to site_content.hero; finally
  // to the hardcoded copy. Empty strings count as "not set" so clearing a
  // field in the editor doesn't render a blank heading.
  const pick = (key: string, fallback: string): string => {
    const fromBlock = s[key];
    if (typeof fromBlock === "string" && fromBlock.trim() !== "") return fromBlock;
    const fromSite = siteHero[key];
    if (typeof fromSite === "string" && fromSite.trim() !== "") return fromSite;
    return fallback;
  };
  const pickOptional = (key: string): string | undefined => {
    const fromBlock = s[key];
    if (typeof fromBlock === "string" && fromBlock.trim() !== "") return fromBlock;
    const fromSite = siteHero[key];
    if (typeof fromSite === "string" && fromSite.trim() !== "") return fromSite;
    return undefined;
  };

  const title = pick("title", "شخصیت کافه‌ای‌ات\nرو کشف کن");
  const subtitle = pickOptional("subtitle");
  const badge = pickOptional("badge");
  const ctaText = pick("cta_text", "شروع تست");
  const ctaUrl = pick("cta_url", "/test/info");
  const note = typeof s.note === "string" ? s.note : "رایگان · بدون ثبت‌نام · کمتر از ۳ دقیقه";
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
            <p className="text-base leading-[1.9] text-pretty mx-auto max-w-md text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.45 }} className="w-full max-w-xs">
          <Link to={ctaUrl} className="block w-full">
            <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
              className="relative block w-full py-[18px] rounded-2xl text-lg font-extrabold text-center cursor-pointer select-none overflow-hidden text-foreground"
              style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 55%, #d4af37 160%)", boxShadow: "0 10px 44px rgba(159,18,57,0.5), inset 0 1px 0 rgba(255,255,255,0.14)" }}>
              <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)" }}
                animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }} />
              <span className="relative z-10">{ctaText}</span>
            </motion.span>
          </Link>
          {note !== "" && <p className="mt-3 text-xs text-text-tertiary">{note}</p>}
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
  
  // Lazy loading with IntersectionObserver for below-the-fold images
  const [imgRef, isVisible] = useIntersectionObserver(() => {}, { threshold: 0.1 });
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div ref={cardRef} style={{ scale, opacity }} className="relative shrink-0 snap-center rounded-3xl overflow-hidden">
      <div className="relative w-[72vw] sm:w-[52vw] md:w-[42vw] lg:w-[32vw] aspect-[3/4]"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,175,55,0.18)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
        <div ref={imgRef} className="absolute inset-0">
          {isVisible ? (
            <motion.img 
              src={image.image_url} 
              alt={image.title || `gallery-${index + 1}`} 
              loading="lazy" 
              decoding="async"
              style={{ x: imgX }}
              className="absolute inset-0 w-[140%] h-full object-cover"
              draggable={false}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <ImageSkeleton aspectRatio="3/4" className="absolute inset-0" />
          )}
        </div>
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
  
  // Lazy loading for gallery images
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setVisibleImages((prev) => new Set(prev).add(index));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "50px" });

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      imageRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="relative px-5 py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <div className={`grid grid-cols-3 ${cols[columns] ?? "md:grid-cols-6"} gap-2.5`}>
          {images.map((img, i) => {
            const isVisible = visibleImages.has(i);
            return (
              <motion.div 
                key={img.id} 
                ref={(el) => (imageRefs.current[i] = el)}
                variants={fadeUp} 
                initial="hidden" 
                whileInView="show" 
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="relative aspect-square rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}
              >
                {isVisible ? (
                  <img 
                    src={img.image_url} 
                    alt={img.title || "تصویر کافه"} 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <ImageSkeleton aspectRatio="1/1" className="absolute inset-0" />
                )}
              </motion.div>
            );
          })}
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
        style={{ background: "rgba(159,18,57,0.06)", border: "1px solid rgba(159,18,57,0.18)", backdropFilter: "blur(14px)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.4)" }}>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 text-center">
              <span className="text-4xl sm:text-5xl font-extrabold text-accent">{item.value}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">{item.label}</span>
            </motion.div>
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
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center" dir="rtl">
        {s.title && <h3 className="text-xl font-extrabold mb-3 text-foreground">{s.title}</h3>}
        {s.text && <p className="text-sm leading-[1.95] whitespace-pre-wrap text-muted-foreground">{s.text}</p>}
      </motion.div>
    </section>
  );
}
function ImageBlockSection({ s }: { s: any }) {
  if (!s.url) return null;
  return (
    <section className="relative px-5 py-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative group rounded-3xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
        <img src={s.url} alt={s.caption ?? ""} className="w-full transition-transform duration-500 group-hover:scale-[1.02]" />
      </motion.div>
      {s.caption && <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }}
        className="text-xs text-center mt-3 text-muted-foreground">{s.caption}</motion.p>}
    </section>
  );
}
function VideoBlockSection({ s }: { s: any }) {
  if (!s.url) return null;
  const [isPlaying, setIsPlaying] = useState(false);
  const getEmbedUrl = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    const vimMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimMatch) return `https://player.vimeo.com/video/${vimMatch[1]}?autoplay=1`;
    return url;
  };
  const getThumbnail = (url: string) => {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    return null;
  };
  const thumbnail = getThumbnail(s.url);
  return (
    <section className="relative px-5 py-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative group"
        style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
        {isPlaying ? (
          <div className="aspect-video">
            <iframe src={getEmbedUrl(s.url)} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media"
              title={s.title || "video"} />
          </div>
        ) : (
          <div className="aspect-video relative cursor-pointer" onClick={() => setIsPlaying(true)}>
            {thumbnail ? (
              <img src={thumbnail} alt={s.title || "video"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(159,18,57,0.2) 0%, rgba(10,10,10,0.8) 100%)" }} />
            )}
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.25)" }}>
              <motion.div whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.95 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(212,175,55,0.2)", border: "2px solid rgba(212,175,55,0.5)", backdropFilter: "blur(12px)", boxShadow: "0 0 40px rgba(212,175,55,0.2)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-accent ml-1">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
          </div>
        )}
        {s.title && <div className="px-5 py-3 text-center text-sm font-bold text-foreground" style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>{s.title}</div>}
      </motion.div>
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
      <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-sm leading-[1.95] whitespace-pre-wrap text-center text-muted-foreground">{s.text}</motion.p>
    </section>
  );
}

function ButtonSection({ s }: { s: any }) {
  if (!s.label) return null;
  const href = s.url || "#";
  return (
    <section className="relative px-5 py-8 text-center">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <a href={href}>
          <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
            className="inline-block px-8 py-3.5 rounded-2xl text-sm font-bold text-foreground cursor-pointer select-none overflow-hidden relative"
            style={s.style === "outline"
              ? { border: "1px solid rgba(255,255,255,0.2)", background: "transparent" }
              : s.style === "secondary"
                ? { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }
                : { background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)", boxShadow: "0 8px 32px rgba(159,18,57,0.35)" }}>
            {s.style !== "outline" && s.style !== "secondary" && (
              <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)" }}
                animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }} />
            )}
            <span className="relative z-10">{s.label}</span>
          </motion.span>
        </a>
      </motion.div>
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
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto rounded-3xl p-6 text-right"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.4)" }}>
        {s.title && (
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <path d="M17 8h1a4 4 0 0 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
          </div>
        )}
        <ul className="text-sm divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {items.map((it: { name: string; price?: string }, i: number) => (
            <motion.li key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex justify-between items-center py-3 gap-3">
              <span className="text-foreground font-medium">{it.name}</span>
              {it.price && <span className="text-xs font-bold px-3 py-1 rounded-full text-accent whitespace-nowrap" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.18)" }}>{it.price}</span>}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}

function GalleryStaticSection({ s }: { s: any }) {
  const images: string[] = Array.isArray(s.images) ? s.images.filter(Boolean) : [];
  if (images.length === 0) return null;
  return (
    <section className="relative px-5 py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {images.map((url, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.3)" }}>
            <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </motion.div>
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
            <motion.details key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl p-4 text-right group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
              <summary className="cursor-pointer text-sm font-bold text-foreground flex items-center justify-between gap-3 list-none">
                <span>{it.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-accent flex-shrink-0 transition-transform duration-300 group-open:rotate-180">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <p className="text-sm mt-3 leading-[1.9] text-muted-foreground">{it.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}
function InstagramSection({ s }: { s: any }) {
  if (!s.handle) return null;
  const handle = String(s.handle).replace("@", "");
  return (
    <section className="relative px-5 py-10 text-center">
      <motion.a href={`https://instagram.com/${handle}`} target="_blank" rel="noopener noreferrer"
        whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-bold text-accent transition-all duration-300"
        style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", backdropFilter: "blur(8px)", boxShadow: "0 8px 32px rgba(212,175,55,0.08)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        @{handle}
      </motion.a>
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

/* ─────────────── Header ─────────────── */
function HeaderSection({ s }: { s: any }) {
  if (!s.title && !s.subtitle) return null;
  return (
    <section className="relative px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center">
        {s.title && <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">{s.title}</h2>}
        {s.subtitle && <p className="text-sm mt-2 text-muted-foreground">{s.subtitle}</p>}
      </motion.div>
    </section>
  );
}

/* ─────────────── Quote ─────────────── */
function QuoteSection({ s }: { s: any }) {
  if (!s.text) return null;
  return (
    <section className="relative px-5 py-16">
      <motion.figure variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 text-right"
        style={{ background: "rgba(159,18,57,0.06)", border: "1px solid rgba(159,18,57,0.18)", backdropFilter: "blur(14px)" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(212,175,55,0.3)" className="mb-4" aria-hidden="true">
          <path d="M9.5 4C6.5 4 4 6.5 4 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C11 6.5 11 4 9.5 4Zm9 0C15.5 4 13 6.5 13 9.5c0 2.6 1.9 4.8 4.4 5.4-.2 2-1.3 3.2-3 3.8l.7 1.3c3-1 5-3.4 5-7.3V9.5C20 6.5 20 4 18.5 4Z" />
        </svg>
        <blockquote className="text-sm sm:text-base leading-[1.9] text-text-tertiary">{s.text}</blockquote>
        {s.author && <figcaption className="text-xs mt-4 text-muted-foreground">— {s.author}</figcaption>}
      </motion.figure>
    </section>
  );
}

/* ─────────────── Contact ─────────────── */
function ContactSection({ s }: { s: any }) {
  const phone = s.phone as string | undefined;
  const email = s.email as string | undefined;
  const whatsapp = s.whatsapp as string | undefined;
  const items = Array.isArray(s.items) ? s.items : [];
  const hasFlatFields = phone || email || whatsapp;
  const hasItems = items.length > 0;
  if (!hasFlatFields && !hasItems && !s.title && !s.text) return null;

  const contactItems: Array<{ label: string; value: string; icon: string; href?: string }> = [];
  if (phone) contactItems.push({ label: "تلفن", value: phone, icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" });
  if (email) contactItems.push({ label: "ایمیل", value: email, icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z|M22 6l-10 7L2 6" });
  if (whatsapp) contactItems.push({ label: "واتس‌اپ", value: whatsapp, href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`, icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" });
  if (hasItems) items.forEach((it: { label?: string; value?: string; icon?: string }) => { if (it.value) contactItems.push({ label: it.label || "", value: it.value, icon: it.icon || "" }); });

  return (
    <section className="relative px-5 py-20">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {s.title && <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />}
        {s.text && <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm leading-[1.9] text-center text-muted-foreground">{s.text}</motion.p>}
        {contactItems.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactItems.map((item, i) => {
              const Wrapper = item.href ? "a" : "div";
              const wrapperProps = item.href ? { href: item.href, target: "_blank", rel: "noopener noreferrer" } : {};
              return (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}>
                  <Wrapper {...wrapperProps as any} className="block rounded-2xl p-5 text-right transition-all duration-300 hover:scale-[1.02]"
                    style={{ background: "rgba(159,18,57,0.05)", border: "1px solid rgba(159,18,57,0.15)", backdropFilter: "blur(12px)" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                          <path d={item.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase text-muted-foreground" style={{ letterSpacing: "0.1em" }}>{item.label}</span>
                        <p className="text-sm font-bold text-foreground truncate" dir={item.label === "تلفن" || item.label === "واتس‌اپ" || item.label === "ایمیل" ? "ltr" : undefined}>{item.value}</p>
                      </div>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── Map ─────────────── */
function MapSection({ s }: { s: any }) {
  const lat = Number(s.lat);
  const lng = Number(s.lng);
  const embed = s.embed as string | undefined;
  const url = s.url as string | undefined;
  const hasCoords = !isNaN(lat) && !isNaN(lng);
  if (!embed && !url && !hasCoords) return null;
  const mapSrc = embed || url || `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&marker=${lat}%2C${lng}`;
  return (
    <section className="relative px-5 py-10">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto rounded-3xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
        <div className="relative aspect-video" style={{ background: "rgba(0,0,0,0.3)" }}>
          <iframe
            src={mapSrc}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            loading="lazy"
            title={s.label || "map"}
          />
        </div>
        {s.label && (
          <div className="px-5 py-3 text-center text-sm font-bold text-foreground"
            style={{ background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {s.label}
          </div>
        )}
      </motion.div>
    </section>
  );
}

/* ─────────────── Social Networks ─────────────── */
const SOCIAL_PLATFORMS: Record<string, { label: string; color: string; svgPath: string; fill?: boolean }> = {
  instagram: { label: "اینستاگرام", color: "#E4405F", svgPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", fill: true },
  telegram: { label: "تلگرام", color: "#26A5E4", svgPath: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z", fill: true },
  whatsapp: { label: "واتس‌اپ", color: "#25D366", svgPath: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z", fill: true },
  twitter: { label: "توییتر", color: "#1DA1F2", svgPath: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", fill: true },
  youtube: { label: "یوتیوب", color: "#FF0000", svgPath: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", fill: true },
  spotify: { label: "اسپاتیفای", color: "#1DB954", svgPath: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z", fill: true },
  website: { label: "وبسایت", color: "#d4af37", svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z", fill: false },
  default: { label: "لینک", color: "#d4af37", svgPath: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", fill: false },
};

function SocialPlatformIcon({ platform, className }: { platform: string; className?: string }) {
  const cls = className || "w-5 h-5";
  const p = SOCIAL_PLATFORMS[platform] || SOCIAL_PLATFORMS.default;
  if (p.fill) {
    return <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d={p.svgPath} /></svg>;
  }
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={p.svgPath} /></svg>;
}

function SocialSection({ s }: { s: any }) {
  const links: Array<{ platform?: string; url?: string }> = Array.isArray(s.links) ? s.links : [];
  const items: Array<{ label?: string; url?: string; icon?: string; color?: string }> = Array.isArray(s.items) ? s.items : [];
  const allLinks = links.length > 0
    ? links.filter((l) => l.url).map((l) => ({
        platform: l.platform || "website",
        url: l.url!,
        label: (SOCIAL_PLATFORMS[l.platform || "default"] || SOCIAL_PLATFORMS.default).label,
        color: (SOCIAL_PLATFORMS[l.platform || "default"] || SOCIAL_PLATFORMS.default).color,
      }))
    : items.filter((it) => it.url).map((it) => ({
        platform: "website",
        url: it.url!,
        label: it.label || "",
        color: it.color || "#d4af37",
      }));
  if (allLinks.length === 0) return null;
  return (
    <section className="relative px-5 py-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {s.title && <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {allLinks.map((item, i) => (
            <motion.a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -6, scale: 1.08, boxShadow: `0 12px 40px ${item.color}33` }}
              whileTap={{ scale: 0.94 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center cursor-pointer group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}33` }}>
                <SocialPlatformIcon platform={item.platform} className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">{item.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── Booking ─────────────── */
function BookingSection({ s }: { s: any }) {
  if (!s.title && !s.text && !s.ctaLabel && !s.button_label) return null;
  const label = s.ctaLabel || s.button_label || "رزرو کنید";
  const href = s.button_url || s.url || "#";
  return (
    <section className="relative px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
        style={{ background: "rgba(159,18,57,0.07)", border: "1px solid rgba(159,18,57,0.2)", backdropFilter: "blur(14px)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
        {s.title && <h3 className="text-xl sm:text-2xl font-extrabold text-foreground relative z-10">{s.title}</h3>}
        {s.text && <p className="text-sm mt-3 leading-[1.9] text-muted-foreground relative z-10">{s.text}</p>}
        {label && (
          <a href={href} className="inline-block mt-6 relative z-10">
            <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
              className="relative block px-8 py-3.5 rounded-2xl text-sm font-bold text-foreground cursor-pointer select-none overflow-hidden"
              style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 100%)", boxShadow: "0 8px 32px rgba(159,18,57,0.35)" }}>
              <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)", borderRadius: "inherit" }}
                animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }} />
              <span className="relative z-10">{label}</span>
            </motion.span>
          </a>
        )}
      </motion.div>
    </section>
  );
}

/* ─────────────── Test (Personality Test) ─────────────── */
function TestSection({ s }: { s: any }) {
  const label = s.ctaLabel || s.button_label || "شروع تست";
  return (
    <section className="relative px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
        style={{ background: "rgba(159,18,57,0.07)", border: "1px solid rgba(159,18,57,0.2)", backdropFilter: "blur(14px)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.06) 0%, transparent 60%)" }} />
        {s.title && <h3 className="text-xl sm:text-2xl font-extrabold text-foreground relative z-10">{s.title}</h3>}
        {s.text && <p className="text-sm mt-3 leading-[1.9] text-muted-foreground relative z-10">{s.text}</p>}
        <Link to="/test/info" className="inline-block mt-6 relative z-10">
          <motion.span whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.96 }}
            className="relative block px-8 py-3.5 rounded-2xl text-lg font-extrabold text-foreground cursor-pointer select-none overflow-hidden"
            style={{ background: "linear-gradient(135deg, #9f1239 0%, #be123c 55%, #d4af37 160%)", boxShadow: "0 10px 44px rgba(159,18,57,0.5), inset 0 1px 0 rgba(255,255,255,0.14)" }}>
            <motion.span aria-hidden="true" className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)" }}
              animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }} />
            <span className="relative z-10">{label}</span>
          </motion.span>
        </Link>
        {s.note && <p className="text-xs mt-4 text-text-tertiary relative z-10">{s.note}</p>}
      </motion.div>
    </section>
  );
}

/* ─────────────── Event ─────────────── */
function EventSection({ s, ctx }: { s: any; ctx: LandingCtx }) {
  const eventsArray = Array.isArray(s.events) ? s.events : [];
  const fromCtx = ctx.events.slice(0, Number(s.count ?? 3));
  const displayEvents = eventsArray.length > 0 ? eventsArray : fromCtx;
  if (displayEvents.length === 0) return null;
  return (
    <section className="relative px-5 py-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEvents.map((ev: any, i: number) => (
            <motion.div key={ev.id ?? i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden flex flex-col group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
              <div className="relative h-44 overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
                {ev.image_url && <img src={ev.image_url} alt={ev.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                {ev.date && (
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-bold text-accent"
                    style={{ background: "rgba(13,10,14,0.8)", border: "1px solid rgba(212,175,55,0.25)", backdropFilter: "blur(8px)" }}>
                    {new Date(ev.date).toLocaleDateString("fa-IR")}
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 text-right">
                {ev.date_label && <span className="text-xs font-bold text-accent">{ev.date_label}</span>}
                <h3 className="text-base font-extrabold text-foreground">{ev.title}</h3>
                {ev.description && <p className="text-xs leading-[1.7] text-muted-foreground line-clamp-2">{ev.description}</p>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────── Countdown ─────────────── */
function CountdownSection({ s }: { s: any }) {
  const targetDate = s.target ? new Date(s.target).getTime() : s.target_date ? new Date(s.target_date).getTime() : null;
  if (!targetDate) return null;

  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <section className="relative px-5 py-16">
      <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto flex flex-col gap-6">
        {s.title && <h3 className="text-xl font-extrabold text-center text-foreground">{s.title}</h3>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["days", "hours", "minutes", "seconds"].map((unit, i) => {
            const labels = { days: "روز", hours: "ساعت", minutes: "دقیقه", seconds: "ثانیه" };
            return (
              <motion.div key={unit} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(159,18,57,0.05)", border: "1px solid rgba(159,18,57,0.15)", backdropFilter: "blur(8px)" }}>
                <span className="text-3xl font-extrabold text-accent">{String(timeLeft[unit as keyof typeof timeLeft]).padStart(2, "0")}</span>
                <span className="text-xs mt-1 block text-muted-foreground">{labels[unit as keyof typeof labels]}</span>
              </motion.div>
            );
          })}
        </div>
        {s.text && <p className="text-xs text-center text-muted-foreground">{s.text}</p>}
      </motion.div>
    </section>
  );
}

/* ─────────────── File (Downloadable File) ─────────────── */
function FileSection({ s }: { s: any }) {
  const files: Array<{ label?: string; url?: string; icon?: string }> = Array.isArray(s.files) ? s.files : [];
  const singleFile = s.url ? [{ label: s.label, url: s.url, icon: s.icon }] : [];
  const allFiles = files.length > 0 ? files : singleFile;
  if (allFiles.length === 0 && !s.title && !s.text) return null;
  return (
    <section className="relative px-5 py-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        {s.title && <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />}
        {s.text && <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-sm leading-[1.9] text-center text-muted-foreground">{s.text}</motion.p>}
        {allFiles.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            {allFiles.map((file: { label?: string; url?: string; icon?: string }, i: number) => (
              <motion.a key={i} href={file.url} download={file.label}
                whileHover={{ y: -3, scale: 1.02, boxShadow: "0 12px 40px rgba(159,18,57,0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl text-sm font-bold text-foreground transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </div>
                <span>{file.label || "دانلود فایل"}</span>
                {s.size && <span className="text-xs text-muted-foreground">{s.size}</span>}
              </motion.a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ─────────────── Music ─────────────── */
function MusicSection({ s }: { s: any }) {
  const tracks: Array<{ title?: string; artist?: string; url?: string; cover?: string; duration?: string }> = Array.isArray(s.tracks) ? s.tracks : [];
  const provider = s.provider as string | undefined;
  const embedUrl = s.url as string | undefined;
  const hasEmbed = provider && embedUrl;
  const hasTracks = tracks.length > 0;
  if (!hasEmbed && !hasTracks) return null;

  if (hasEmbed) {
    let iframeSrc = embedUrl;
    if (provider === "spotify") {
      const match = embedUrl.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
      if (match) iframeSrc = `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
    } else if (provider === "youtube") {
      const match = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
      if (match) iframeSrc = `https://www.youtube.com/embed/${match[1]}`;
    }
    return (
      <section className="relative px-5 py-16">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {s.title && <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />}
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 25px 60px -25px rgba(0,0,0,0.65)" }}>
            <iframe
              src={iframeSrc}
              className="w-full"
              style={{ height: provider === "spotify" ? "352px" : "315px" }}
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={`${provider} player`}
            />
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-5 py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {s.title && <SectionHeading kicker={s.kicker} title={s.title} subtitle={s.subtitle} />}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track: { title?: string; artist?: string; url?: string; cover?: string; duration?: string }, i: number) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl overflow-hidden flex flex-col group"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}>
              {track.cover && (
                <div className="relative h-36 overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
                  <img src={track.cover} alt={track.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <motion.button onClick={() => track.url && window.open(track.url, "_blank")}
                      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(212,175,55,0.2)", border: "1px solid rgba(212,175,55,0.4)", backdropFilter: "blur(8px)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-accent ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              )}
              <div className="p-4 flex flex-col gap-2 flex-1">
                <div className="flex-1">
                  {track.title && <h4 className="text-sm font-bold text-foreground">{track.title}</h4>}
                  {track.artist && <p className="text-xs text-muted-foreground">{track.artist}</p>}
                </div>
                <div className="flex items-center justify-between">
                  {track.duration && <span className="text-xs text-text-tertiary">{track.duration}</span>}
                  {!track.cover && (
                    <motion.button onClick={() => track.url && window.open(track.url, "_blank")}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-accent ml-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
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
  "header", "quote", "contact", "map", "social", "booking", "test", "event", "countdown", "file", "music",
] as const;
export type LandingBlockType = (typeof LANDING_BLOCK_TYPES)[number];

function dispatch(type: string, settings: any, ctx: LandingCtx): React.ReactNode {
  switch (normalizeBlockType(type)) {
    case "hero": return <HeroSection s={settings} ctx={ctx} />;
    case "header": return <HeaderSection s={settings} />;
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
    case "event": return <EventSection s={settings} ctx={ctx} />;
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
    case "quote": return <QuoteSection s={settings} />;
    case "contact": return <ContactSection s={settings} />;
    case "map": return <MapSection s={settings} />;
    case "social": return <SocialSection s={settings} />;
    case "booking": return <BookingSection s={settings} />;
    case "test": return <TestSection s={settings} />;
    case "countdown": return <CountdownSection s={settings} />;
    case "file": return <FileSection s={settings} />;
    case "music": return <MusicSection s={settings} />;
    default: return null;
  }
}

export const LandingBlockRender = memo(function LandingBlockRender({
  type, settings, ctx,
}: { type: string; settings: Record<string, unknown>; ctx: LandingCtx }) {
  return <>{dispatch(type, settings, ctx)}</>;
});
