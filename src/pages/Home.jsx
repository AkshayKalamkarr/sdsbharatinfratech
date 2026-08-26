import { useEffect, useRef, useState, memo } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */

const BRAND = "SDS BHARAT INFRA TECH";

/* Brand colors — pulled from the SDS Bharat Infra Tech logo */
const C_PRIMARY = "#F4A01E"; // amber
const C_SECONDARY = "#E84C24"; // orange-red

/* ─────────────────────────────────────────────
   GLOBAL SCROLL MANAGER
   Single rAF loop instead of one per component
───────────────────────────────────────────── */
const scrollListeners = new Set();
let rafScheduled = false;

function globalScrollTick() {
  rafScheduled = false;
  scrollListeners.forEach((fn) => fn());
}

function addScrollListener(fn) {
  scrollListeners.add(fn);
  if (scrollListeners.size === 1) {
    window.addEventListener("scroll", scheduleRaf, { passive: true });
  }
}

function removeScrollListener(fn) {
  scrollListeners.delete(fn);
  if (scrollListeners.size === 0) {
    window.removeEventListener("scroll", scheduleRaf);
  }
}

function scheduleRaf() {
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(globalScrollTick);
  }
}

/* ─────────────────────────────────────────────
   HOOK — Intersection Observer (fires once)
───────────────────────────────────────────── */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          ob.unobserve(el);
        }
      },
      { threshold: 0.12, ...opts },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   HOOK — matchMedia driven breakpoint flag
   Lets a couple of components make small layout
   decisions in JS without re-measuring on every render
───────────────────────────────────────────── */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    // setMatches(mql.matches)
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [query]);
  return matches;
}


/* ─────────────────────────────────────────────
   FANCY IMAGE — parallax + clip-path reveal
   All heavy props on GPU-composited layers
───────────────────────────────────────────── */
const FancyImg = memo(function FancyImg({
  src,
  alt,
  style,
  revealIn,
  delay = 0,
  parallax = false,
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const wrapRef = useRef(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isParallax = parallax && !reduceMotion;

  useEffect(() => {
    if (!isParallax) return;
    const tick = () => {
      const el = wrapRef.current;
      if (!el || !imgRef.current) return;
      const rect = el.getBoundingClientRect();
      const prog =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const offset = (prog - 0.5) * 60;
      imgRef.current.style.transform = `scale(1.12) translateY(${offset}px) translateZ(0)`;
    };
    addScrollListener(tick);
    return () => removeScrollListener(tick);
  }, [isParallax]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
        ...style,
      }}
    >
      {/* Skeleton — opacity-only transition, zero paint. Tinted with a soft brand-amber wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#fbe6c4",
          opacity: loaded ? 0 : 1,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <img
        ref={imgRef}
        src={src}
        alt={alt || ""}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          transform: isParallax
            ? "scale(1.12) translateZ(0)"
            : "scale(1) translateZ(0)",
          opacity: loaded ? 1 : 0,
          transition: loaded
            ? isParallax
              ? "opacity 0.6s ease"
              : "opacity 0.6s ease, transform 0.85s cubic-bezier(.22,1,.36,1)"
            : "none",
          willChange: isParallax ? "transform" : "opacity",
        }}
      />

      {/* Clip-path wipe overlay — GPU-composited */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#faf9f7",
          clipPath: revealIn
            ? "polygon(0 0,100% 0,100% 0,0 0)"
            : "polygon(0 0,100% 0,100% 100%,0 100%)",
          transition: `clip-path 1.2s cubic-bezier(.22,1,.36,1) ${delay}s`,
          pointerEvents: "none",
          zIndex: 2,
          willChange: "clip-path",
        }}
      />
    </div>
  );
});

/* ─────────────────────────────────────────────
   TEXT BLOCK — staggered children
───────────────────────────────────────────── */
const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 7h8M8 4l3 3-3 3"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function TextBlock({ label, heading, italic, body, btn, inView, style }) {
  return (
    <div className={`stagger-wrap ${inView ? "revealed" : ""}`} style={style}>
      {label && <p className="sc label-text">{label}</p>}
      <h2
        className="sc serif-head"
        style={{ fontStyle: italic ? "italic" : "normal" }}
      >
        {heading}
      </h2>
      {body && <p className="sc body-text">{body}</p>}
      {btn && <div className="sc know-btn-wrap">{btn}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Home() {
  const [promiseRef, promiseInView] = useInView();
  const [purposeRef, purposeInView] = useInView();

  const [interiorRef, interiorInView] = useInView();
  const [civilRef, civilInView] = useInView();
  const [hortiRef, hortiInView] = useInView();

  const [hospRef, hospInView] = useInView();

  return (
    <div
      className="ub-home-root"
      style={{
        background: "#faf9f7",
        color: "#1a1610",
        overflowX: "hidden",
        width: "100%",
        minHeight: "100dvh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }

        /*
          Global full-bleed reset.
          Not scoped on purpose — <style> tags aren't CSS-modules, so this
          reaches html/body/#root even though they live outside this component.
          Without it, a stray body margin or a #root without width/height set
          is the usual reason a "full screen" layout shows up boxed-in or
          with a visible band of empty page around it.
        */
        html, body {
          margin:0; padding:0;
          width:100%;
          min-height:100%;
          overflow-x:hidden;
        }
        #root, #app {
          margin:0; padding:0;
          width:100%;
          min-height:100dvh;
          display:block;
        }
        .ub-home-root { display:block; }

        img, svg, video { max-width:100%; }

        /*
          All keyframes use only transform/opacity.
          shimmerSlide uses translateX instead of background-position
          → runs on the compositor thread, zero main-thread cost.
        */
        @keyframes shimmerSlide {
          0%   { transform:translateX(-100%) translateZ(0); }
          100% { transform:translateX(200%)  translateZ(0); }
        }
        @keyframes heroUp    { from{opacity:0;transform:translateY(28px) translateZ(0)} to{opacity:1;transform:translateY(0) translateZ(0)} }
        @keyframes bounce    { 0%,100%{transform:translateX(-50%) translateY(0) translateZ(0)} 50%{transform:translateX(-50%) translateY(8px) translateZ(0)} }
        @keyframes lineSweep { from{transform:scaleX(0) translateZ(0)} to{transform:scaleX(1) translateZ(0)} }
        @keyframes floatDot  { 0%,100%{transform:translateY(0) scale(1) translateZ(0)} 50%{transform:translateY(-12px) scale(1.1) translateZ(0)} }
        @keyframes videoFade { from{opacity:0;transform:scale(1.06) translateZ(0)} to{opacity:1;transform:scale(1) translateZ(0)} }
        @keyframes cardReveal{ from{opacity:0;transform:translateY(28px) scale(0.95) translateZ(0)} to{opacity:1;transform:translateY(0) scale(1) translateZ(0)} }

        .hero-eyebrow { animation:heroUp 1.2s cubic-bezier(.22,1,.36,1) forwards 0.9s; opacity:0; }
        .hero-text    { animation:heroUp 1.3s cubic-bezier(.22,1,.36,1) forwards 1.1s; opacity:0; will-change:transform,opacity; }
        .hero-line    { transform-origin:left; animation:lineSweep 1s cubic-bezier(.22,1,.36,1) forwards 1.5s; transform:scaleX(0); will-change:transform; }
        video.hero-video { animation:videoFade 1.8s cubic-bezier(.22,1,.36,1) forwards; will-change:transform,opacity; }

        /* Stagger reveal — only transform+opacity, always composited */
        .stagger-wrap .sc {
          opacity:0;
          transform:translateY(24px) translateZ(0);
          transition:opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1);
          will-change:opacity,transform;
        }
        .stagger-wrap.revealed .sc { opacity:1; transform:translateY(0) translateZ(0); }
        .stagger-wrap.revealed .sc:nth-child(1){transition-delay:0.05s}
        .stagger-wrap.revealed .sc:nth-child(2){transition-delay:0.18s}
        .stagger-wrap.revealed .sc:nth-child(3){transition-delay:0.32s}
        .stagger-wrap.revealed .sc:nth-child(4){transition-delay:0.48s}

        .label-text { font-family:'DM Sans',sans-serif; font-size:0.6rem; letter-spacing:0.26em; text-transform:uppercase; color:${C_SECONDARY}; margin-bottom:0.65rem; }
        .serif-head { font-family:'Cormorant Garamond',serif; font-size:clamp(1.5rem,5vw,2.35rem); font-weight:400; line-height:1.24; color:#1a1610; margin-bottom:0.9rem; }
        .body-text  { font-family:'DM Sans',sans-serif; font-size:clamp(0.78rem,2.2vw,0.8rem); color:#5a5550; line-height:1.9; max-width:340px; margin-bottom:1.6rem; }
        .know-btn-wrap a, .know-btn-wrap button, .know-btn {
          display:inline-flex; align-items:center; gap:0.5rem;
          border:1px solid ${C_PRIMARY}; color:${C_SECONDARY}; background:transparent;
          cursor:pointer; font-family:'DM Sans',sans-serif; font-size:0.68rem;
          letter-spacing:0.16em; text-transform:uppercase; padding:0.62rem 1.5rem;
          text-decoration:none;
          transition:background 0.35s, color 0.35s, box-shadow 0.35s, border-color 0.35s;
          -webkit-tap-highlight-color:transparent;
        }
        .know-btn-wrap a:hover, .know-btn-wrap button:hover, .know-btn:hover,
        .know-btn-wrap a:active, .know-btn-wrap button:active, .know-btn:active {
          background:linear-gradient(135deg, ${C_PRIMARY}, ${C_SECONDARY});
          border-color:${C_SECONDARY};
          color:#fff;
          box-shadow:0 8px 24px rgba(232,76,36,0.28);
        }

        .fl { font-family:'DM Sans',sans-serif; font-size:0.74rem; color:rgba(255,255,255,0.52); display:block; margin-bottom:0.55rem; text-decoration:none; transition:color 0.2s,transform 0.2s; will-change:transform; }
        .fl:hover { color:${C_PRIMARY}; transform:translateX(6px) translateZ(0); }
        .si { width:32px; height:32px; border-radius:50%; border:1px solid rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.6); text-decoration:none; transition:background 0.3s,color 0.3s,transform 0.3s; will-change:transform; }
        .si:hover { background:linear-gradient(135deg, ${C_PRIMARY}, ${C_SECONDARY}); color:#fff; transform:scale(1.1) translateZ(0); }

        /* Dev grid — fluid, auto-fits down to a sensible card width before wrapping to 1-up */
        .dev-grid {
          display:grid;
          gap:clamp(0.8rem,2vw,1.6rem);
          grid-template-columns:repeat(4,minmax(0,1fr));
        }
        .dev-card { opacity:0; will-change:opacity,transform; min-width:0; }
        .dev-grid.revealed .dev-card {
          animation:cardReveal 0.75s cubic-bezier(.22,1,.36,1) forwards;
        }
        .dev-grid.revealed .dev-card:nth-child(1){ animation-delay:0.05s }
        .dev-grid.revealed .dev-card:nth-child(2){ animation-delay:0.16s }
        .dev-grid.revealed .dev-card:nth-child(3){ animation-delay:0.27s }
        .dev-grid.revealed .dev-card:nth-child(4){ animation-delay:0.38s }
        .dev-grid.revealed .dev-card:nth-child(5){ animation-delay:0.49s }
        .dev-grid.revealed .dev-card:nth-child(6){ animation-delay:0.60s }
        .dev-grid.revealed .dev-card:nth-child(7){ animation-delay:0.71s }
        .dev-grid.revealed .dev-card:nth-child(8){ animation-delay:0.82s }
        .dev-grid.revealed .dev-card:nth-child(9){ animation-delay:0.93s }
        .dev-grid.revealed .dev-card:nth-child(10){ animation-delay:1.04s }
        .dev-grid.revealed .dev-card:nth-child(11){ animation-delay:1.15s }

        .dev-card-label { margin-top:0.55rem; padding:0 0.1rem; }
        .dev-card-name  { font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:500; color:#2a2520; line-height:1.3; }
        .dev-card-loc   { font-family:'DM Sans',sans-serif; font-size:0.68rem; color:${C_SECONDARY}; margin-top:0.18rem; letter-spacing:0.04em; }

        .presence-accent { display:inline-block; width:36px; height:1px; background:linear-gradient(to right, ${C_PRIMARY}, ${C_SECONDARY}); margin:0 auto; }

        /* Services strip — Interior / Civil / Horticulture */
        .services-strip {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:clamp(0.9rem,2.5vw,1.75rem);
          max-width:1080px;
          margin:0 auto;
        }
        .service-tile { position:relative; overflow:hidden; opacity:0; will-change:opacity,transform; }
        .services-strip.revealed .service-tile { animation:cardReveal 0.8s cubic-bezier(.22,1,.36,1) forwards; }
        .services-strip.revealed .service-tile:nth-child(1){ animation-delay:0.05s }
        .services-strip.revealed .service-tile:nth-child(2){ animation-delay:0.2s }
        .services-strip.revealed .service-tile:nth-child(3){ animation-delay:0.35s }
        .service-tile-caption {
          position:absolute; left:0; right:0; bottom:0;
          padding:1.4rem 1.2rem 1.1rem;
          background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.62) 100%);
          z-index:4; pointer-events:none;
        }
        .service-tile-label { font-family:'DM Sans',sans-serif; font-size:0.58rem; letter-spacing:0.22em; text-transform:uppercase; color:${C_PRIMARY}; margin-bottom:0.3rem; }
        .service-tile-title { font-family:'Cormorant Garamond',serif; font-style:italic; font-size:1.25rem; color:#fff; line-height:1.2; }

        /* ── Responsive breakpoints ───────────────────────────── */
        @media(max-width:1200px){ .dev-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
        @media(max-width:900px) { .dev-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
        @media(max-width:560px) { .dev-grid{ grid-template-columns:1fr; } }

        @media(max-width:768px) {
          .two-col      { grid-template-columns:1fr !important; }
          .purpose-grid { grid-template-columns:1fr !important; }
          .img-right-group{ min-height:340px !important; }
          .services-strip { grid-template-columns:1fr !important; }
        }
        @media(max-width:480px) {
          .img-right-group { grid-template-columns:1fr !important; min-height:auto !important; }
        }
        @media(max-width:380px) {
          .serif-head { font-size:1.35rem; }
        }

        /* Respect reduced-motion preferences: keep the page smooth without
           forcing motion on people who've asked their OS to minimize it. */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration:0.01ms !important;
            animation-iteration-count:1 !important;
            transition-duration:0.01ms !important;
          }
        }
      `}</style>

      {/* ═══ DISCOUNT NOTIFICATION ═══ */}
      {/* <DiscountNotification visible={showNotif} onClose={closeNotif} /> */}

      {/* ═══ §1 HERO ═══ */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          minHeight: 480,
          overflow: "hidden",
        }}
      >
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            willChange: "transform,opacity",
          }}
        >
          <source src="/videos/herosection.mp4" type="video/mp4" />
        </video>

        {/* Overlays — no animation, just static layers */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg,rgba(0,0,0,0.08) 0%,rgba(0,0,0,0) 40%,rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(0,0,0,0.25) 0%,transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Floating rings — translateZ forces own compositor layer, hidden on small screens to reduce clutter */}
        <div
          className="hero-ring"
          style={{
            position: "absolute",
            top: "22%",
            right: "10%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px solid rgba(244,160,30,0.35)",
            animation: "floatDot 6s ease-in-out infinite",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />
        <div
          className="hero-ring"
          style={{
            position: "absolute",
            top: "28%",
            right: "13%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "1px solid rgba(232,76,36,0.3)",
            animation: "floatDot 6s ease-in-out infinite 1.5s",
            pointerEvents: "none",
            willChange: "transform",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "14%",
            left: "clamp(1.25rem,7vw,5rem)",
            right: "clamp(1.25rem,7vw,5rem)",
            zIndex: 2,
          }}
        >
          <p
            className="hero-text"
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontStyle: "italic",
              fontSize: "clamp(1.7rem,6vw,3.8rem)",
              fontWeight: 300,
              color: "#ffffff",
              letterSpacing: "0.02em",
              lineHeight: 1.22,
              maxWidth: 620,
            }}
          >
           SDS BHARAT INFRA TECH
          </p>
        </div>

        <div
          className="hero-line"
          style={{
            position: "absolute",
            bottom: "8%",
            left: "clamp(1.25rem,7vw,5rem)",
            zIndex: 2,
            width: 52,
            height: 2,
            background: `linear-gradient(90deg, ${C_PRIMARY}, ${C_SECONDARY})`,
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            zIndex: 2,
            animation: "bounce 1.8s ease-in-out infinite",
            willChange: "transform",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 7l6 6 6-6"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      {/* ═══ §2 OUR PROMISE ═══ */}
      <section
        style={{
          background: "#faf9f7",
          padding: "clamp(3rem,8vw,6rem) clamp(1.25rem,7vw,5.5rem)",
        }}
      >
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
            gap: "clamp(1.75rem,5vw,5rem)",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <FancyImg
            src="/images/home/architecture.png"
            revealIn={promiseInView}
            parallax
            style={{ height: "clamp(240px,50vw,460px)" }}
          />
          <div ref={promiseRef}>
            <TextBlock
              inView={promiseInView}
              label="Our Promise"
              heading={
                <>
                  Raising the Standard
                  <br />
                  of Living
                </>
              }
              body={`${BRAND}, Transparency integrity, and innovation are at the core of everything we do, ensuring that every project — from homes to the roads and utilities that connect them — reflects our promise of excellence, reliability, and long-term value. Whether it's a first home, a growing family space, or vital civic infrastructure, each Unique Builders project is designed to blend modern lifestyles with enduring trust, making dreams tangible one brick at a time.`}
              btn={
                <Link to="/our-story" className="know-btn">
                  Know More <ArrowIcon />
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* ═══ §3 OUR PURPOSE ═══ */}
      <section
        style={{
          background: "#faf9f7",
          padding: "0 clamp(1.25rem,7vw,5.5rem) clamp(3rem,8vw,6rem)",
        }}
      >
        <div
          className="purpose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,0.8fr) minmax(0,1.4fr)",
            gap: "clamp(1.75rem,5vw,4.5rem)",
            alignItems: "stretch",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <div
            ref={purposeRef}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <TextBlock
              inView={purposeInView}
              label="Our Purpose"
              heading="Building with Purpose. Living with Impact."
              italic
              body={`${BRAND}, our purpose is to create spaces and civic infrastructure that go beyond construction — developments that inspire better living, roads and utilities that strengthen communities, and lasting value at every scale. Every project we build is guided by integrity, innovation, and a commitment to enhancing the way people live and move.`}
            />
          </div>
          <div
            className="img-right-group"
            style={{
              display: "grid",
              gridTemplateColumns: "1.35fr 0.85fr",
              gap: 6,
              minHeight: "clamp(300px,50vw,580px)",
            }}
          >
            <div style={{ position: "relative", overflow: "hidden" }}>
              <FancyImg
                src="/images/portfolio/civil.jpg"
                revealIn={purposeInView}
                style={{ height: "100%", minHeight: 220 }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontStyle: "italic",
                    fontSize: "0.85rem",
                    color: "#fff",
                  }}
                >
                  Our Story
                </span>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7h8M8 4l3 3-3 3"
                    stroke="#fff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{ position: "relative", overflow: "hidden", flex: 1 }}
              >
                <FancyImg
                  src="/images/portfolio/img-1.jpg"
                  revealIn={purposeInView}
                  delay={0.2}
                  style={{ height: "100%", minHeight: 120 }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.7rem",
                    left: "0.7rem",
                    zIndex: 4,
                    pointerEvents: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontStyle: "italic",
                      fontSize: "0.72rem",
                      color: "#fff",
                    }}
                  >
                    Our Impact
                  </span>
                </div>
              </div>
              <div
                style={{ position: "relative", overflow: "hidden", flex: 1 }}
              >
                <FancyImg
                  src="/images/portfolio/interior.jpeg"
                  revealIn={purposeInView}
                  delay={0.4}
                  style={{ height: "100%", minHeight: 120 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ §4 INTERIOR ═══ */}
      <section
        style={{
          background: "#faf9f7",
          padding: "clamp(3rem,8vw,6rem) clamp(1.25rem,7vw,5.5rem)",
        }}
      >
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
            gap: "clamp(1.75rem,5vw,5rem)",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <FancyImg
            src="/images/services/interior.jpeg"
            alt="Interior design fit-out by SDS Bharat Infra Tech"
            revealIn={interiorInView}
            parallax
            style={{ height: "clamp(240px,50vw,460px)" }}
          />
          <div ref={interiorRef}>
            <TextBlock
              inView={interiorInView}
              label="Interior Design & Fit-Outs"
              heading={
                <>
                  Interiors that
                  <br />
                  Feel Like Home
                </>
              }
              body="From concept to handover, our interior design team shapes spaces that are as functional as they are beautiful — residential apartments, model flats, corporate offices, and commercial fit-outs. We handle space planning, false ceilings and lighting design, modular kitchens and wardrobes, flooring and wall finishes, and bespoke furniture, working closely with our civil and MEP teams so design intent survives all the way to execution."
              btn={
                <Link to="/interiors" className="know-btn">
                  Know More <ArrowIcon />
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* ═══ §5 CIVIL ENGINEERING & CONSTRUCTION ═══ */}
      <section
        style={{
          background: "#faf9f7",
          padding: "0 clamp(1.25rem,7vw,5.5rem) clamp(3rem,8vw,6rem)",
        }}
      >
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.1fr)",
            gap: "clamp(1.75rem,5vw,5rem)",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <div ref={civilRef}>
            <TextBlock
              inView={civilInView}
              label="Civil & Infrastructure"
              italic
              heading="Engineering Strength. Building Trust."
              body="Our civil engineering division delivers the structural backbone behind every SDS Bharat project — foundations, RCC framework, roads and pavements, stormwater and utility networks, retaining structures, and site development works. Backed by qualified structural engineers and rigorous quality control at every pour, we build civic and residential infrastructure engineered to last, on schedule and to specification."
              btn={
                <Link to="/civil-engineering" className="know-btn">
                  Know More <ArrowIcon />
                </Link>
              }
            />
          </div>
          <FancyImg
            src="/images/services/industrial-building.jpg"
            alt="Civil engineering and road infrastructure works"
            revealIn={civilInView}
            parallax
            style={{ height: "clamp(240px,50vw,460px)" }}
          />
        </div>
      </section>

      {/* ═══ §6 HORTICULTURE & LANDSCAPING ═══ */}
      <section
        style={{
          background: "#faf9f7",
          padding: "0 clamp(1.25rem,7vw,5.5rem) clamp(3rem,8vw,6rem)",
        }}
      >
        <div
          className="two-col"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)",
            gap: "clamp(1.75rem,5vw,5rem)",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <FancyImg
            src="/images/services/horticulture-design.jpg"
            alt="Landscaped gardens and horticulture at an SDS Bharat project"
            revealIn={hortiInView}
            parallax
            style={{ height: "clamp(240px,50vw,460px)" }}
          />
          <div ref={hortiRef}>
            <TextBlock
              inView={hortiInView}
              label="Horticulture & Landscaping"
              heading={
                <>
                  Green Spaces,
                  <br />
                  Living Landscapes
                </>
              }
              body="Landscape and horticulture are part of the master plan, not an afterthought. Our team designs and maintains podium gardens, avenue and street plantations, native and low-maintenance greenery, irrigation systems, and open-space amenities that soften the built environment and give every development a lasting sense of place — for residents, commuters, and the communities around our infrastructure projects alike."
              btn={
                <Link to="/horticulture" className="know-btn">
                  Know More <ArrowIcon />
                </Link>
              }
            />
          </div>
        </div>
      </section>

      {/* ═══ §7 OUR SERVICES AT A GLANCE ═══ */}
      <section
        style={{
          background: "#fdf1de",
          padding: "clamp(3rem,8vw,6rem) clamp(1.25rem,7vw,5.5rem)",
        }}
      >
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(1.75rem,5vw,3rem)" }}>
            <p className="label-text" style={{ marginBottom: "0.6rem" }}>
              What We Do
            </p>
            <h2 className="serif-head" style={{ marginBottom: 0 }}>
              Interior. Civil. Horticulture.
            </h2>
            <span className="presence-accent" style={{ marginTop: "0.9rem" }} />
          </div>

          <ServicesStrip />
        </div>
      </section>

    </div>
  );
}

/* ─────────────────────────────────────────────
   SERVICES STRIP — Interior / Civil / Horticulture
   Compact three-up summary tiles, reuses FancyImg
───────────────────────────────────────────── */
function ServicesStrip() {
  const [ref, inView] = useInView();

  const services = [
    {
      src: "/services/interior-designs/interior-2.JPG",
      alt: "Interior design and fit-out work",
      label: "Interior",
      title: "Spaces, finished right",
    },
    {
      src: "/services/civil-construction/civil-2.JPG",
      alt: "Civil engineering and construction site",
      label: "Civil",
      title: "Structure you can trust",
    },
    {
      src: "/services/horticulture-design/horticulture-12.jpg",
      alt: "Horticulture and landscaped gardens",
      label: "Horticulture",
      title: "Green, by design",
    },
  ];

  return (
    <div
      ref={ref}
      className={`services-strip ${inView ? "revealed" : ""}`}
    >
      {services.map((s, i) => (
        <div
          key={s.label}
          className="service-tile"
          style={{ height: "clamp(220px,32vw,300px)" }}
        >
          <FancyImg
            src={s.src}
            alt={s.alt}
            revealIn={inView}
            delay={i * 0.15}
            style={{ height: "100%" }}
          />
          <div className="service-tile-caption">
            <p className="service-tile-label">{s.label}</p>
            <p className="service-tile-title">{s.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}