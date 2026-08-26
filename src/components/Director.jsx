import { Award, Leaf, TrendingUp, Users } from "lucide-react";
import { useState, useEffect, useRef, memo, useCallback } from "react";

/* ─────────────────────────────────────────────
   GLOBAL INTERSECTION OBSERVER POOL
   One shared root observer instead of N instances.
   Each element registers a one-shot callback.
───────────────────────────────────────────── */
const ioCallbacks = new WeakMap()
let sharedIO = null

function getSharedIO() {
  if (!sharedIO) {
    sharedIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const cb = ioCallbacks.get(e.target)
            if (cb) { cb(); ioCallbacks.delete(e.target); sharedIO.unobserve(e.target) }
          }
        })
      },
      { threshold: 0.1 }
    )
  }
  return sharedIO
}

function useFadeIn(delay = 0) {
  const ref     = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = getSharedIO()
    ioCallbacks.set(el, () => {
      if (delay) setTimeout(() => setVis(true), delay)
      else setVis(true)
    })
    io.observe(el)
    return () => { ioCallbacks.delete(el); io.unobserve(el) }
  }, [delay])

  return [ref, vis]
}

/* ─────────────────────────────────────────────
   FADE-IN WRAPPER
   Only animates transform + opacity — compositor-only,
   zero main-thread paint cost.
───────────────────────────────────────────── */
const FadeIn = memo(function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, vis] = useFadeIn(delay)
  return (
    <div
      ref={ref}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? "translateY(0) translateZ(0)" : "translateY(28px) translateZ(0)",
        transition: "opacity 0.85s cubic-bezier(.22,1,.36,1), transform 0.85s cubic-bezier(.22,1,.36,1)",
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  )
})

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const QUALIFICATIONS = [
  { degree: "B.E.",  field: "Civil Engineering" },
  { degree: "MBA",   field: "Marketing"         },
  { degree: "B.Sc.", field: "Horticulture"      },
]

const STRENGTHS = [
  { Icon: Award,      title: "Leadership",             desc: "Empowering teams with a clear vision and leading by example across every level of the organization." },
  { Icon: TrendingUp, title: "Business Strategy",      desc: "Transforming ambitious ideas into high-performing, scalable enterprises with disciplined execution."  },
  { Icon: Users,      title: "Operational Excellence", desc: "Building cultures grounded in integrity, collaboration, and continuous improvement."                  },
  { Icon: Leaf,       title: "Sustainability",         desc: "Forward-thinking, environmentally responsible development for a resilient future."                    },
]

const EXPERTISE = ["Real Estate", "Architecture", "Landscape Development", "Civil Engineering", "Business Strategy", "Market Dynamics"]

const BIO = [
  "A visionary entrepreneur with over 20 years of extensive experience across Real Estate, Architecture, and Landscape Development, the Director brings a strong multidisciplinary foundation to the organization. With academic qualifications in Civil Engineering, Marketing, and Horticulture, he combines technical expertise with strategic business insight to drive sustainable growth in the built environment sector.",
  "Throughout his professional journey, he has demonstrated a consistent commitment to excellence, innovation, and value-driven leadership. As a co-founder of multiple successful ventures, he has played a pivotal role in transforming ideas into high-performing and scalable business enterprises, working alongside a team of like-minded professionals.",
  "Under his leadership, the organization achieved remarkable growth within a short span of five years, reaching a net worth exceeding ₹50 crore and generating annual revenues in the range of ₹50–100 crore. This accomplishment reflects his strategic vision, disciplined execution, and strong understanding of market dynamics and customer needs.",
  "Looking ahead, he remains focused on expanding business horizons, delivering impactful developments, and contributing to the advancement of the real estate and infrastructure sector with a forward-thinking and environmentally responsible approach.",
]

/* ─────────────────────────────────────────────
   STRENGTH CARD — isolated hover state
   memo + local state = no parent re-renders
───────────────────────────────────────────── */
const StrengthCard = memo(function StrengthCard({ Icon, title, desc, delay }) {
  const [hov, setHov] = useState(false)
  const enter = useCallback(() => setHov(true),  [])
  const leave = useCallback(() => setHov(false), [])

  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={enter}
        onMouseLeave={leave}
        style={{
          background:    "#f7f2eb",
          padding:       "44px 32px",
          borderBottom:  hov ? "3px solid #b89b6e" : "3px solid transparent",
          transform:     hov ? "translateY(-4px) translateZ(0)" : "translateY(0) translateZ(0)",
          boxShadow:     hov ? "0 16px 48px rgba(184,155,110,0.1)" : "none",
          transition:    "border-color 0.25s, transform 0.3s cubic-bezier(.22,1,.36,1), box-shadow 0.3s",
          cursor:        "default",
          willChange:    "transform",
          contain:       "layout style",
        }}
      >
        <div style={{
          width:46, height:46,
          border:"1px solid rgba(184,155,110,0.3)",
          borderRadius:"50%",
          display:"flex", alignItems:"center", justifyContent:"center",
          marginBottom:24, color:"#b89b6e",
          flexShrink:0,
        }}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:23, fontWeight:400, color:"#18120a", marginBottom:12 }}>{title}</h3>
        <p  style={{ fontFamily:"'Jost',sans-serif", fontSize:13, lineHeight:1.75, color:"#6a5a48" }}>{desc}</p>
      </div>
    </FadeIn>
  )
})

/* ─────────────────────────────────────────────
   PORTRAIT IMAGE — lazy + scale hover
───────────────────────────────────────────── */
const PortraitImg = memo(function PortraitImg({ src, alt }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      style={{ position:"relative", overflow:"hidden", borderRadius:2, contain:"layout style" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <img
        src={src} alt={alt}
        loading="lazy" decoding="async"
        style={{
          width:"100%",
          aspectRatio:"3/4",
          objectFit:"cover", objectPosition:"center top",
          display:"block",
          transform: hov ? "scale(1.04) translateZ(0)" : "scale(1) translateZ(0)",
          transition:"transform 0.7s cubic-bezier(.22,1,.36,1)",
          willChange:"transform",
        }}
      />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"#b89b6e" }} />
    </div>
  )
})

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function Director() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        img { display:block; max-width:100%; }

        /*
          All keyframes: transform + opacity only.
          No filter, background-position, width, height, top, left transitions
          in animation — everything GPU-composited.
        */

        /* ── HERO ── */
        .dh {
          position:relative;
          min-height:100vh;
          display:grid;
          grid-template-columns:1fr 42%;
          background:#0a0602;
          overflow:hidden;
        }

        /* Grain texture — static pseudo, no animation cost */
        .dh::before {
          content:'';
          position:absolute; inset:0;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none;
          z-index:0;
        }

        /* Gold vertical rule */
        .dh-vline {
          position:absolute; left:64px; top:0; bottom:0;
          width:1px;
          background:linear-gradient(180deg,transparent,rgba(184,155,110,.38) 25%,rgba(184,155,110,.38) 75%,transparent);
          z-index:2;
          display:flex; align-items:center;
        }
        .dh-dot {
          width:6px; height:6px; border-radius:50%;
          background:#b89b6e;
          margin-left:-3px;
          box-shadow:0 0 10px rgba(184,155,110,.5);
        }

        /* Left content */
        .dh-content {
          position:relative; z-index:2;
          display:flex; flex-direction:column; justify-content:center;
          padding:100px 72px 100px 112px;
        }
        .dh-super {
          font-family:'Jost',sans-serif; font-size:9px;
          letter-spacing:.32em; text-transform:uppercase;
          color:#b89b6e; margin-bottom:28px;
        }
        .dh-name {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(38px,5.5vw,80px);
          font-weight:300; line-height:1.05;
          color:#fff; margin-bottom:24px; letter-spacing:.015em;
        }
        .dh-rule { width:52px; height:1px; background:linear-gradient(90deg,#b89b6e,transparent); margin-bottom:30px; }
        .dh-quote {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(16px,2vw,24px);
          font-weight:300; font-style:italic;
          color:rgba(255,255,255,.72); line-height:1.6;
          margin-bottom:44px;
          padding-left:18px;
          border-left:1px solid rgba(184,155,110,.3);
        }
        .dh-quals { display:flex; flex-direction:column; gap:12px; margin-bottom:48px; }
        .dh-qual  { display:flex; align-items:center; gap:14px; }
        .dh-deg   { font-family:'Jost',sans-serif; font-size:10px; font-weight:600; letter-spacing:.16em; color:#b89b6e; min-width:42px; }
        .dh-qsep  { width:24px; height:1px; background:rgba(184,155,110,.28); flex-shrink:0; }
        .dh-qfield{ font-family:'Jost',sans-serif; font-size:12px; color:rgba(255,255,255,.55); letter-spacing:.07em; }
        .dh-scroll{ display:flex; align-items:center; gap:10px; }
        .dh-scroll-line { width:40px; height:1px; background:rgba(184,155,110,.35); }
        .dh-scroll-lbl  { font-family:'Jost',sans-serif; font-size:9px; letter-spacing:.24em; text-transform:uppercase; color:rgba(255,255,255,.3); }

        /* Right portrait */
        .dh-portrait { position:relative; overflow:hidden; contain:layout style; }
        .dh-portrait img {
          width:100%; height:100%;
          object-fit:cover; object-position:center top;
          display:block;
          /* Static filter — no transition = no repaint loop */
          filter:brightness(.94) contrast(1.04);
        }
        .dh-portrait-fade   { position:absolute; inset:0; background:linear-gradient(90deg,#0a0602 0%,rgba(10,6,2,.45) 22%,transparent 52%); pointer-events:none; z-index:1; }
        .dh-portrait-fade-b { position:absolute; bottom:0; left:0; right:0; height:220px; background:linear-gradient(180deg,transparent,rgba(10,6,2,.72)); pointer-events:none; z-index:1; }
        .dh-portrait-bar    { position:absolute; bottom:0; left:0; right:0; height:3px; background:linear-gradient(90deg,#b89b6e,#d4b483,#b89b6e); z-index:2; }

        /* Corner frames — pure borders, no paint */
        .dh-portrait-frame-tl,
        .dh-portrait-frame-br { position:absolute; width:52px; height:52px; z-index:3; pointer-events:none; }
        .dh-portrait-frame-tl { top:20px; right:20px; border-top:1px solid rgba(184,155,110,.5); border-right:1px solid rgba(184,155,110,.5); }
        .dh-portrait-frame-br { bottom:20px; right:20px; border-bottom:1px solid rgba(184,155,110,.5); border-right:1px solid rgba(184,155,110,.5); }

        /* Name overlay */
        .dh-portrait-id   { position:absolute; bottom:28px; left:0; right:0; z-index:4; padding:0 32px; }
        .dh-portrait-name { font-family:'Cormorant Garamond',serif; font-size:clamp(18px,2vw,26px); font-weight:300; color:#fff; letter-spacing:.04em; line-height:1.2; }
        .dh-portrait-role { font-family:'Jost',sans-serif; font-size:9px; letter-spacing:.24em; text-transform:uppercase; color:#b89b6e; margin-top:6px; }

        /* Years badge */
        .dh-portrait-badge { position:absolute; top:36px; left:-1px; z-index:4; background:#b89b6e; padding:14px 18px; display:flex; flex-direction:column; align-items:center; }
        .dh-badge-val { font-family:'Cormorant Garamond',serif; font-size:30px; font-weight:300; color:#18120a; line-height:1; }
        .dh-badge-lbl { font-family:'Jost',sans-serif; font-size:8px; letter-spacing:.14em; text-transform:uppercase; color:rgba(24,18,10,.7); margin-top:4px; white-space:nowrap; }

        /* ── STATS ── */
        .ds { background:#18120a; display:grid; grid-template-columns:repeat(2,1fr); }
        .ds-cell { padding:52px 32px; text-align:center; border-right:1px solid rgba(184,155,110,.1); }
        .ds-cell:last-child { border-right:none; }
        .ds-val { font-family:'Cormorant Garamond',serif; font-size:clamp(34px,4vw,56px); font-weight:300; color:#b89b6e; line-height:1; margin-bottom:10px; }
        .ds-lbl { font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,.38); line-height:1.7; }

        /* ── BIO ── */
        .db       { background:#fff; padding:120px 96px; }
        .db-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1.65fr; gap:96px; align-items:start; }
        .db-left  { position:sticky; top:100px; }
        .d-stag   { font-family:'Jost',sans-serif; font-size:9px; letter-spacing:.3em; text-transform:uppercase; color:#b89b6e; margin-bottom:20px; }
        .d-h2     { font-family:'Cormorant Garamond',serif; font-size:clamp(26px,3vw,46px); font-weight:300; line-height:1.22; color:#18120a; margin-bottom:26px; }
        .d-hrule  { width:40px; height:1px; background:#b89b6e; margin-bottom:36px; }
        .db-tags  { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:44px; }
        .db-tag   { font-family:'Jost',sans-serif; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:#8a7460; border:1px solid rgba(184,155,110,.28); padding:6px 14px; border-radius:2px; }
        .db-para  { font-family:'Jost',sans-serif; font-size:15px; line-height:1.92; color:#4a3a2a; margin-bottom:30px; }

        /* ── PORTRAIT SECTION ── */
        .dp       { background:#f7f2eb; padding:100px 96px; }
        .dp-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1.1fr; gap:88px; align-items:center; }
        .dp-img-wrap { position:relative; }
        .dp-offset   { position:absolute; top:20px; right:-20px; bottom:-20px; left:20px; border:1px solid rgba(184,155,110,.22); border-radius:2px; z-index:-1; }
        .dp-name { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,3.8vw,54px); font-weight:300; color:#18120a; line-height:1.1; margin-bottom:10px; }
        .dp-role { font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:#b89b6e; margin-bottom:36px; }
        .dp-pull { font-family:'Cormorant Garamond',serif; font-size:clamp(16px,1.9vw,23px); font-weight:300; font-style:italic; color:#5a4a38; line-height:1.65; margin-bottom:40px; }
        .dp-quals { display:flex; flex-direction:column; gap:14px; }
        .dp-qual  { display:flex; align-items:center; gap:14px; }
        .dp-deg   { font-family:'Jost',sans-serif; font-size:10px; font-weight:600; letter-spacing:.14em; color:#b89b6e; min-width:44px; }
        .dp-sep   { width:20px; height:1px; background:rgba(184,155,110,.3); flex-shrink:0; }
        .dp-field { font-family:'Jost',sans-serif; font-size:12px; color:#6a5a48; letter-spacing:.07em; }

        /* ── STRENGTHS ── */
        .dstr     { background:#fff; padding:100px 96px; }
        .dstr-hdr { text-align:center; margin-bottom:64px; }
        .dstr-grid{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }

        /* ── QUOTE BANNER ── */
        .dq     { position:relative; overflow:hidden; padding:130px 48px; }
        /* Static darkening via filter on a separate img element = one GPU texture, never repainted */
        .dq-img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.18); pointer-events:none; }
        .dq-body{ position:relative; z-index:1; max-width:880px; margin:0 auto; text-align:center; }
        .dq-line { width:1px; height:64px; background:rgba(184,155,110,.4); margin:0 auto; }
        .dq-text { font-family:'Cormorant Garamond',serif; font-size:clamp(20px,3vw,46px); font-weight:300; font-style:italic; color:#fff; line-height:1.48; letter-spacing:.02em; margin:40px 0; }
        .dq-attr { font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.24em; text-transform:uppercase; color:rgba(255,255,255,.38); margin-top:32px; }

        /* ── RESPONSIVE ── */
        @media(max-width:1100px) {
          .dstr-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:900px) {
          .dh { grid-template-columns:1fr; min-height:auto; }
          .dh-portrait { height:72vw; max-height:500px; order:-1; }
          .dh-portrait-badge { top:20px; }
          .dh-content { padding:56px 36px 72px; justify-content:flex-start; }
          .dh-vline { display:none; }
          .ds { grid-template-columns:1fr 1fr; }
          .db { padding:72px 36px; }
          .db-inner { grid-template-columns:1fr; gap:40px; }
          .db-left  { position:static; }
          .dp { padding:72px 36px; }
          .dp-inner { grid-template-columns:1fr; gap:48px; }
          .dp-offset { display:none; }
          .dstr { padding:72px 36px; }
          .dq   { padding:96px 32px; }
        }
        @media(max-width:600px) {
          .dstr-grid { grid-template-columns:1fr; }
          .dh-content { padding:40px 20px 56px; }
          .dh-name    { font-size:clamp(32px,9vw,52px); }
          .db   { padding:56px 20px; }
          .dp   { padding:56px 20px; }
          .dstr { padding:56px 20px; }
          .dq   { padding:80px 20px; }
          .ds-cell { padding:40px 20px; }
        }
        @media(max-width:400px) {
          .dh-content { padding:32px 16px 48px; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="dh">
        <div className="dh-vline"><div className="dh-dot" /></div>

        {/* LEFT */}
        <div className="dh-content">
          <FadeIn>
            <p className="dh-super">Co-Founder &amp; Director — Unique Builders &amp; Developers</p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="dh-name">Lakshminarayan<br />Pillai</h1>
          </FadeIn>
          <FadeIn delay={140}>
            <div className="dh-rule" />
            <p className="dh-quote">"Designing Legacy.<br />Building the Future."</p>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="dh-quals">
              {QUALIFICATIONS.map(q => (
                <div key={q.degree} className="dh-qual">
                  <span className="dh-deg">{q.degree}</span>
                  <div className="dh-qsep" />
                  <span className="dh-qfield">{q.field}</span>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={280}>
            <div className="dh-scroll">
              <div className="dh-scroll-line" />
              <p className="dh-scroll-lbl">Scroll to explore</p>
            </div>
          </FadeIn>
        </div>

        {/* RIGHT */}
        <div className="dh-portrait">
          <img
            src="/images/director/laxmi.jpg"
            alt="Lakshminarayan Pillai"
            loading="eager"
            decoding="async"
          />
          <div className="dh-portrait-fade"   />
          <div className="dh-portrait-fade-b" />
          <div className="dh-portrait-bar"    />
          <div className="dh-portrait-frame-tl" />
          <div className="dh-portrait-frame-br" />
          <div className="dh-portrait-badge">
            <span className="dh-badge-val">20+</span>
            <span className="dh-badge-lbl">Years of<br />Excellence</span>
          </div>
          <div className="dh-portrait-id">
            <p className="dh-portrait-name">Lakshminarayan Pillai</p>
            <p className="dh-portrait-role">Co-Founder &amp; Director</p>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="ds">
        {[
          { val: "20+", lbl: "Years of\nExperience" },
          { val: "3",   lbl: "Academic\nDegrees"    },
        ].map(({ val, lbl }) => (
          <FadeIn key={lbl}>
            <div className="ds-cell">
              <div className="ds-val">{val}</div>
              <div className="ds-lbl" style={{ whiteSpace:"pre-line" }}>{lbl}</div>
            </div>
          </FadeIn>
        ))}
      </section>

      {/* ══ BIO ══ */}
      <section className="db">
        <div className="db-inner">
          <FadeIn>
            <div className="db-left">
              <p className="d-stag">About the Director</p>
              <h2 className="d-h2">A legacy built on<br />vision &amp; purpose</h2>
              <div className="d-hrule" />
              <div className="db-tags">
                {EXPERTISE.map(e => <span key={e} className="db-tag">{e}</span>)}
              </div>
            </div>
          </FadeIn>
          <div>
            {BIO.map((p, i) => (
              <FadeIn key={i} delay={i * 90}>
                <p
                  className="db-para"
                  style={i === 0 ? { borderLeft:"2px solid #b89b6e", paddingLeft:22 } : {}}
                >{p}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STRENGTHS ══ */}
      <section className="dstr">
        <FadeIn>
          <div className="dstr-hdr">
            <p className="d-stag" style={{ textAlign:"center" }}>Core Strengths</p>
            <h2 className="d-h2"  style={{ textAlign:"center" }}>What drives his leadership</h2>
            <div className="d-hrule" style={{ margin:"0 auto" }} />
          </div>
        </FadeIn>
        <div className="dstr-grid">
          {STRENGTHS.map(({ Icon, title, desc }, i) => (
            <StrengthCard key={title} Icon={Icon} title={title} desc={desc} delay={i * 80} />
          ))}
        </div>
      </section>

      {/* ══ QUOTE BANNER ══ */}
      <section className="dq">
        <img
          className="dq-img"
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=75"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
        />
        <div className="dq-body">
          <FadeIn>
            <div className="dq-line" />
            <p className="dq-text">
              "A consistent commitment to excellence, innovation, and value-driven leadership — shaping developments that stand the test of time."
            </p>
            <div className="dq-line" />
            <p className="dq-attr">Lakshminarayan Pillai · Co-Founder &amp; Director</p>
          </FadeIn>
        </div>
      </section>
    </>
  )
}