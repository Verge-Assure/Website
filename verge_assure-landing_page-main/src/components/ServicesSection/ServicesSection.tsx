import { useEffect, useRef, useState } from "react";
import "./ServicesSection.css";

// ── Card Component ────────────────────────────────────────────────────
interface SvcCardProps {
  id: string;
  category: string;
  active: boolean;
  title: string;
  description: string;
}

function SvcCard({ id, category, active, title, description }: SvcCardProps) {
  return (
    <div className={`svc-card ${active ? "svc-card--active" : ""}`}>
      <div className="svc-card-top">
        <span className="svc-card-num">{id}</span>
        <span className="svc-card-category">{category}</span>
        <span className="svc-corner-mark" />
      </div>
      <div className="svc-card-body">
        <div className="svc-card-body--text">
          <h3 className="svc-card-title">{title}</h3>
          <p className="svc-card-desc">{description}</p>
        </div>
      </div>
      <div className={`svc-card-foot ${active ? "svc-card-foot--active" : ""}`}>
        <div className="svc-card-foot-inner">
          <span className="svc-va-badge">VA</span>
          <a href="#" className="svc-card-link">
            Learn more <span className="svc-card-arrow">→</span>
          </a>
        </div>
        <span className="svc-corner-mark" />
      </div>
    </div>
  );
}

// Cursor stop positions on the center line (%) for each active index
const CURSOR_STOPS = [20, 50, 80];

// ── Main Section ──────────────────────────────────────────────────────
export function ServicesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onScroll() {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const scrolled = window.scrollY - wrapper.offsetTop;
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      setActiveIndex(Math.min(Math.floor(progress * 3), 2));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="services" ref={wrapperRef} className="svc-wrapper">
      <div className="svc-sticky">
        {/* ── Heading ── */}
        <div className="svc-heading">
          <span className="svc-label">Value Proposition</span>
          <h2 className="svc-title">
            Three ways
            <br />
            we engage.
          </h2>
          <div className="svc-subtitle-row">
            <span className="svc-subtitle-accent" />
            <p className="svc-subtitle">
              Choose how you want to work with us — we meet you where you are.
            </p>
          </div>
        </div>

        {/* ── Timeline ── */}
        <div className="svc-timeline">
          {/* Left column — card 02 */}
          <div className="svc-col svc-col--left">
            <SvcCard
              id="02"
              category="INSURTECH CONSULTING"
              active={activeIndex === 1}
              title="Strategic Tech Advisory"
              description="We audit your workflows, identify bottlenecks, and design architectural roadmaps to accelerate digital growth."
            />
          </div>

          {/* Center progress line */}
          <div className="svc-line-wrap">
            <svg
              className="svc-line-svg"
              width="2"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
            >
              <path
                d="M1 0L1 100"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
                strokeDasharray="2 8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div
              className="svc-cursor"
              style={{ top: `${CURSOR_STOPS[activeIndex]}%` }}
            />
          </div>

          {/* Right column — cards 01 and 03 */}
          <div className="svc-col svc-col--right">
            <SvcCard
              id="01"
              category="CUSTOM PRODUCT DEVELOPMENT"
              active={activeIndex === 0}
              title="Custom Software Solutions"
              description="We build tailored, production-ready platforms that seamlessly bridge legacy infrastructure with modern APIs."
            />
            <SvcCard
              id="03"
              category="STAFF AUGMENTATION"
              active={activeIndex === 2}
              title="Embedded Team Scaling"
              description="Scale engineering speed with top-tier developers and system architects embedded in your teams."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
