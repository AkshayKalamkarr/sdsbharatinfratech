import { useState, useEffect, useRef } from "react";
import { Search, AlignJustify, X, ChevronDown, Phone } from "lucide-react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   CONFIG — update these values as needed
───────────────────────────────────────────── */
const WHATSAPP_NUMBER =  "917021002947";
const WHATSAPP_MESSAGE = "Hello! I'm interested in your properties. Please share more details.";

const commercialProjects = [
  {
    label: "New City Palace",
    location: "Pushpak Nagar, Navi Mumbai",
    slug: "project-1",
  },
  {
    label: "Gajanan Enclave",
    location: "Pushpak Nagar, Navi Mumbai",
    slug: "project-2",
  },
  {
    label: "Unique Palacio",
    location: "Pushpak Nagar, Navi Mumbai",
    slug: "project-3",
  },
  {
    label: "Unique Apartment",
    location: "Ulwe, Navi Mumbai",
    slug: "project-4",
  },
  {
    label: "Ravi Apartment",
    location: "Karanjade, Pushpak Node",
    slug: "project-5",
  },
  { label: "Happy Apartment", location: "Khalapur, Rees", slug: "project-6" },
  { label: "Unique Aura", location: "Pushpak Nagar", slug: "project-7" },
];

function openWhatsApp() {
  const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`,
    "_blank",
    "noopener,noreferrer",
  );
}

/* WhatsApp SVG — reusable */
const WaSvg = ({ size = 14 }) => (
  <svg
    style={{
      width: size,
      height: size,
      fill: "#fff",
      display: "block",
      flexShrink: 0,
    }}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 2C8.268 2 2 8.268 2 16c0 2.522.664 4.888 1.822 6.938L2 30l7.29-1.793A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.43 11.43 0 01-5.82-1.594l-.418-.248-4.33 1.065 1.096-4.218-.272-.433A11.5 11.5 0 1116 27.5zm6.32-8.63c-.347-.174-2.05-1.012-2.368-1.128-.317-.116-.548-.174-.778.174-.23.347-.895 1.128-1.097 1.358-.202.231-.404.26-.75.087-.347-.174-1.466-.54-2.792-1.722-1.032-.92-1.73-2.056-1.933-2.403-.202-.347-.022-.534.152-.707.156-.155.347-.404.52-.606.174-.202.231-.347.347-.578.116-.231.058-.433-.029-.607-.087-.173-.778-1.876-1.066-2.57-.28-.674-.565-.583-.778-.594l-.663-.012c-.231 0-.606.087-.923.433-.317.347-1.21 1.183-1.21 2.885s1.239 3.346 1.412 3.578c.173.231 2.44 3.726 5.91 5.225.826.356 1.47.57 1.972.729.828.264 1.582.226 2.177.137.664-.1 2.05-.838 2.338-1.647.289-.81.289-1.504.202-1.647-.087-.144-.317-.231-.664-.404z" />
  </svg>
);

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* outside-click closes projects dropdown */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setProjectsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMobile = () => setIsOpen(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Montserrat:wght@300;400;500;600&display=swap');

        /* ── CSS VARIABLES ── */
        :root {
          --ub-dark:    #1a1410;
          --ub-brown:   #8B6E52;
          --ub-gold:    #C8A97A;
          --ub-gold-lt: #d4b98a;
          --ub-cream:   #F5EFE6;
          --ub-mid:     rgba(20,13,6,0.90);
          --wa-green:   #25D366;
          --wa-dk:      #1da851;

          --logo-h-default:  68px;   /* ← LOGO height — normal */
          --logo-h-scrolled: 46px;   /* ← LOGO height — scrolled */
          --logo-h-mobile:   52px;   /* ← LOGO height — mobile overlay header */
          --nav-h-default:   104px;
          --nav-h-scrolled:  68px;
        }

        /* ═══════════════════════════════
           NAVBAR SHELL
        ═══════════════════════════════ */
        .ub-nav {
          font-family: 'Montserrat', sans-serif;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        .ub-nav.scrolled {
          background: var(--ub-mid);
          backdrop-filter: blur(22px) saturate(1.5);
          -webkit-backdrop-filter: blur(22px) saturate(1.5);
          box-shadow: 0 2px 48px rgba(0,0,0,0.4);
        }
        .ub-nav:not(.scrolled) {
          background: linear-gradient(180deg, rgba(8,4,1,0.78) 0%, rgba(8,4,1,0.05) 100%);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        /* ── Inner wrapper ── */
        .nav-inner {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 52px;
          height: var(--nav-h-default);
          transition: height 0.3s ease, padding 0.3s ease;
        }
        .scrolled .nav-inner {
          height: var(--nav-h-scrolled);
        }

        /* ══════════════════════════════
           LOGO
        ══════════════════════════════ */
        .ub-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .ub-logo:hover { opacity: 0.85; }
        .ub-logo img {
          height: var(--logo-h-default);
          width: auto;
          object-fit: contain;
          transition: height 0.3s ease;
          display: block;
        }
        .scrolled .ub-logo img {
          height: var(--logo-h-scrolled);
        }

        /* ══════════════════════════════
           CENTER NAV LINKS
        ══════════════════════════════ */
        .nav-center {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .nav-divider {
          width: 1px;
          height: 28px;
          background: rgba(200,169,122,0.22);
          flex-shrink: 0;
        }

        .nav-link {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          text-decoration: none;
          padding: 8px 18px;
          position: relative;
          white-space: nowrap;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 18px; right: 18px;
          height: 1px;
          background: var(--ub-gold);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .nav-link:hover,
        .nav-link.active { color: #fff; }
        .nav-link:hover::after,
        .nav-link.active::after { transform: scaleX(1); }
        .nav-link.active { color: var(--ub-gold); }

        .nav-chevron { transition: transform 0.25s ease; opacity: 0.7; }
        .nav-chevron.open { transform: rotate(180deg); opacity: 1; }

        /* ══════════════════════════════
           RIGHT ACTIONS
        ══════════════════════════════ */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }

        /* WhatsApp button */
        .wa-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 2px;
          white-space: nowrap;
          transition: color 0.2s, background 0.2s;
        }
        .wa-btn:hover {
          color: var(--wa-green);
          background: rgba(37,211,102,0.08);
        }
        .wa-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: var(--wa-dk);
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .wa-btn:hover .wa-icon-wrap { background: var(--wa-green); }

        /* Enquire button */
        .enquire-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.82);
          background: none;
          border: none;
          cursor: pointer;
          padding: 7px 14px;
          border-radius: 2px;
          white-space: nowrap;
          transition: color 0.2s, background 0.2s;
          text-decoration: none;
        }
        .enquire-btn:hover {
          color: var(--ub-gold);
          background: rgba(200,169,122,0.08);
        }

        /* ══════════════════════════════
           MEGA DROPDOWN
        ══════════════════════════════ */
        .mega-dropdown {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: rgba(12,7,3,0.97);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border-top: 1px solid rgba(200,169,122,0.18);
          border-bottom: 1px solid rgba(200,169,122,0.08);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
          z-index: 999;
        }
        .mega-dropdown.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .mega-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 80px 52px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .mega-col {
          padding: 0 36px 0 20px;
          border-right: 1px solid rgba(200,169,122,0.1);
        }
        .mega-col:first-child { padding-left: 0; }
        .mega-col:last-child  { border-right: none; }

        .mega-col-title {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(200,169,122,0.12);
        }
        .mega-item {
          display: block;
          padding: 9px 0;
          border-bottom: 1px solid rgba(200,169,122,0.05);
          text-decoration: none;
          transition: padding-left 0.2s ease;
        }
        .mega-item:last-of-type { border-bottom: none; }
        .mega-item:hover { padding-left: 6px; }

        .mega-item-label {
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.8);
          display: block;
          transition: color 0.2s;
        }
        .mega-item:hover .mega-item-label { color: var(--ub-gold); }

        .mega-item-loc {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(200,169,122,0.4);
          display: block;
          margin-top: 2px;
        }

        /* ══════════════════════════════
           HAMBURGER (mobile trigger)
        ══════════════════════════════ */
        .hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 42px; height: 42px;
          background: none;
          border: 1px solid rgba(200,169,122,0.28);
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          border-radius: 2px;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .hamburger:hover { border-color: var(--ub-gold); color: var(--ub-gold); }

        /* ══════════════════════════════
           MOBILE FULL-SCREEN OVERLAY
        ══════════════════════════════ */
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(6,3,1,0.99);
          backdrop-filter: blur(28px);
          flex-direction: column;
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-overlay.open { display: flex; }

        /* Mobile header */
        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid rgba(200,169,122,0.12);
          flex-shrink: 0;
        }
        .mobile-header-logo img {
          height: var(--logo-h-mobile);
          width: auto;
          object-fit: contain;
          display: block;
        }
        .mobile-logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #fff;
        }
        .mobile-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          background: none;
          border: 1px solid rgba(200,169,122,0.25);
          color: rgba(255,255,255,0.9);
          cursor: pointer;
          border-radius: 2px;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }
        .mobile-close:hover { border-color: var(--ub-gold); color: var(--ub-gold); }

        /* Mobile nav list */
        .mobile-nav {
          padding: 28px 24px 8px;
          flex: 1;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.85);
          text-decoration: none;
          padding: 16px 0;
          border-bottom: 1px solid rgba(200,169,122,0.08);
          transition: color 0.2s;
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          width: 100%;
          cursor: pointer;
          text-align: left;
        }
        .mobile-nav-link:first-child {
          border-top: 1px solid rgba(200,169,122,0.08);
        }
        .mobile-nav-link:hover { color: var(--ub-gold); }

        /* Projects accordion */
        .mobile-projects-list {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mobile-projects-list.open { max-height: 1400px; }

        .mobile-proj-section-title {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(200,169,122,0.5);
          padding: 14px 16px 8px;
        }
        .mobile-project-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 11px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.58);
          border-bottom: 1px solid rgba(200,169,122,0.05);
          background: none;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
          text-align: left;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .mobile-project-item:hover {
          color: var(--ub-gold);
          background: rgba(200,169,122,0.04);
        }
        .mobile-project-item-loc {
          font-size: 9px;
          color: rgba(200,169,122,0.38);
          letter-spacing: 0.1em;
          text-align: right;
          flex-shrink: 0;
          margin-left: 12px;
        }

        /* Mobile actions */
        .mobile-actions {
          padding: 20px 24px 48px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid rgba(200,169,122,0.12);
          flex-shrink: 0;
        }
        .mobile-search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border: 1px solid rgba(200,169,122,0.2);
          border-radius: 2px;
        }
        .mobile-search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 0.1em;
        }
        .mobile-search-input::placeholder { color: rgba(255,255,255,0.28); }

        .mobile-action-row { display: flex; gap: 12px; }
        .mobile-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 10px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.2s;
          border: none;
          text-decoration: none;
        }
        .mobile-action-btn.wa {
          background: var(--wa-dk);
          border: 1px solid var(--wa-green);
          color: #fff;
        }
        .mobile-action-btn.wa:hover { background: var(--wa-green); }
        .mobile-action-btn.solid {
          background: var(--ub-gold);
          border: 1px solid var(--ub-gold);
          color: var(--ub-dark);
        }
        .mobile-action-btn.solid:hover { background: var(--ub-gold-lt); }

        /* ══════════════════════════════
           RESPONSIVE BREAKPOINTS
        ══════════════════════════════ */

        /* Large desktop — tight padding */
        @media (max-width: 1280px) {
          .nav-inner  { padding: 0 36px; }
          .nav-link   { padding: 8px 14px; font-size: 9.5px; }
          .wa-btn,
          .enquire-btn { padding: 7px 10px; }
          .mega-inner { padding: 32px 52px 44px; }
        }

        /* Medium — collapse nav label on WA, reduce gaps */
        @media (max-width: 1080px) {
          :root {
            --logo-h-default:  60px;
            --logo-h-scrolled: 42px;
            --nav-h-default:   90px;
          }
          .nav-inner  { padding: 0 28px; }
          .nav-link   { padding: 8px 11px; font-size: 9px; letter-spacing: 0.16em; }
          .wa-btn     { padding: 7px 8px; }
          .enquire-btn { padding: 7px 8px; }
          .mega-inner { padding: 28px 40px 40px; }
        }

        /* Tablet — hide desktop nav, show hamburger */
        @media (max-width: 900px) {
          .nav-center,
          .nav-actions  { display: none; }
          .hamburger    { display: flex; }
          .mega-dropdown { display: none !important; }

          :root {
            --logo-h-default:  58px;
            --logo-h-scrolled: 40px;
            --nav-h-default:   82px;
            --nav-h-scrolled:  62px;
          }
          .nav-inner { padding: 0 28px; }
        }

        /* Mobile — slightly smaller everything */
        @media (max-width: 600px) {
          :root {
            --logo-h-default:  52px;
            --logo-h-scrolled: 38px;
            --nav-h-default:   74px;
            --nav-h-scrolled:  58px;
            --logo-h-mobile:   46px;
          }
          .nav-inner       { padding: 0 18px; }
          .mobile-nav-link { font-size: 26px; padding: 14px 0; }
          .mobile-header   { padding: 14px 18px; }
          .mobile-nav      { padding: 20px 18px 8px; }
          .mobile-actions  { padding: 16px 18px 40px; }
        }

        /* Extra small */
        @media (max-width: 380px) {
          :root {
            --logo-h-default: 46px;
            --logo-h-mobile:  42px;
          }
          .mobile-nav-link { font-size: 22px; }
        }
      `}</style>

      {/* ════════════ HEADER ════════════ */}
      <header className={`ub-nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          {/* ── Logo ── */}
          <a href="/" className="ub-logo">
            <img src="/images/home/SDS.png" alt="Unique Builders" />
          </a>

          {/* ── Desktop Center Nav ── */}
          <nav className="nav-center" aria-label="Main navigation">
            <Link to="/about-us" className="nav-link">
              About us
            </Link>
            <div className="nav-divider" />
            <Link to="/our-impact" className="nav-link">
              Our Impact
            </Link>
            <div className="nav-divider" />

            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className={`nav-link${projectsOpen ? " active" : ""}`}
                onClick={() => setProjectsOpen(!projectsOpen)}
                aria-expanded={projectsOpen}
                aria-haspopup="true"
              >
                Our Projects
                <ChevronDown
                  size={12}
                  className={`nav-chevron${projectsOpen ? " open" : ""}`}
                />
              </button>
            </div>

            <div className="nav-divider" />
            <Link to="/contact-us" className="nav-link">
              contact us
            </Link>
            <div className="nav-divider" />
          </nav>

          {/* ── Desktop Right Actions ── */}
          <div className="nav-actions">
            <button
              className="wa-btn"
              onClick={openWhatsApp}
              aria-label="Chat on WhatsApp"
            >
              <span className="wa-icon-wrap">
                <WaSvg size={13} />
              </span>
              WhatsApp
            </button>

            <div className="nav-divider" />

            <Link to="/enquiry" className="enquire-btn">
              <Phone size={13} />
              Enquire
            </Link>
          </div>

          {/* ── Hamburger (tablet / mobile) ── */}
          <button
            className="hamburger"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
          >
            <AlignJustify size={20} />
          </button>
        </div>

        {/* ── Mega Dropdown (desktop) ── */}
        <div
          className={`mega-dropdown${projectsOpen ? " show" : ""}`}
          role="region"
          aria-label="Projects menu"
        >
          <div className="mega-inner">
            <div className="mega-col">
              <div className="mega-col-title">Residential</div>
              {commercialProjects.map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="mega-item"
                  onClick={() => setProjectsOpen(false)}
                >
                  <span className="mega-item-label">{p.label}</span>
                  <span className="mega-item-loc">{p.location}</span>
                </Link>
              ))}
            </div>
            {/* Add more .mega-col blocks here for Commercial / Upcoming / etc. */}
          </div>
        </div>
      </header>

      {/* ════════════ MOBILE FULL-SCREEN OVERLAY ════════════ */}
      <div
        className={`mobile-overlay${isOpen ? " open" : ""}`}
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="mobile-header">
          <div className="mobile-header-logo">
            {/* Shows image if available, falls back to text */}
            <img
              src="/images/logo/logo-light.png"
              alt="Unique Builders"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="mobile-logo-text" style={{ display: "none" }}>
              UNIQUE BUILDERS
            </span>
          </div>
          <button
            className="mobile-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="mobile-nav">
          <Link
            to="/our-story"
            className="mobile-nav-link"
            onClick={closeMobile}
          >
            Our Story
          </Link>
          <Link
            to="/our-impact"
            className="mobile-nav-link"
            onClick={closeMobile}
          >
            Our Impact
          </Link>

          {/* Projects accordion */}
          <button
            className="mobile-nav-link"
            onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
            aria-expanded={mobileProjectsOpen}
          >
            Our Projects
            <ChevronDown
              size={20}
              style={{
                transition: "transform 0.28s ease",
                transform: mobileProjectsOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                color: mobileProjectsOpen
                  ? "var(--ub-gold)"
                  : "rgba(255,255,255,0.5)",
                flexShrink: 0,
              }}
            />
          </button>

          <div
            className={`mobile-projects-list${mobileProjectsOpen ? " open" : ""}`}
          >
            <div className="mobile-proj-section-title">Residential</div>
            {commercialProjects.map((p) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className="mobile-project-item"
                onClick={closeMobile}
              >
                <span>{p.label}</span>
                <span className="mobile-project-item-loc">{p.location}</span>
              </Link>
            ))}
          </div>

          <Link
            to="/navi-mumbai"
            className="mobile-nav-link"
            onClick={closeMobile}
          >
            Navi Mumbai Rising
          </Link>
        </nav>

        {/* Bottom actions */}
        <div className="mobile-actions">
          <div className="mobile-search-wrap">
            <Search
              size={15}
              style={{ color: "rgba(200,169,122,0.5)", flexShrink: 0 }}
            />
            <input
              className="mobile-search-input"
              type="search"
              placeholder="Search projects, locations…"
              aria-label="Search"
            />
          </div>

          <div className="mobile-action-row">
            <button className="mobile-action-btn wa" onClick={openWhatsApp}>
              <WaSvg size={15} />
              WhatsApp
            </button>

            <Link
              to="/enquiry"
              className="mobile-action-btn solid"
              onClick={closeMobile}
            >
              <Phone size={14} />
              Enquire
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
