import { BREAKS_BY_PRODUCT, ROLES, THEMES } from "@/data/content";

const pct = (value: number, scale: number) => `${(value / scale) * 100}%`;
const signed = (v: number) => (v > 0 ? `+${v.toFixed(1)}` : `−${Math.abs(v).toFixed(1)}`);

function Legend({ items }: { items: { label: string; className: string }[] }) {
  return (
    <div className="legend">
      {items.map((item) => (
        <span key={item.label}>
          <i className={`dot ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Axis({ ticks, left, right, unit, gap = 20 }: { ticks: string[]; left: number; right: number; unit: string; gap?: number }) {
  return (
    <div className="axis" aria-hidden="true" style={{ gap }}>
      {left > 0 && <span style={{ width: left }} />}
      <div className="axis-ticks">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <span className="axis-unit" style={{ width: right }}>
        {unit}
      </span>
    </div>
  );
}

// Fig. 01: share of low vs high reviews mentioning each theme, grouped by role (notebook 2.6)
export function ThemeGaps() {
  const SCALE = 40;
  return (
    <figure className="chart-card" aria-label="Share of 1–2 star and 4–5 star reviews that mention each theme">
      <div className="chart-top">
        <Legend items={[{ label: "1–2★ reviews", className: "low" }, { label: "4–5★ reviews", className: "high" }]} />
        <span className="mono muted small">gap = low − high, in points</span>
      </div>
      {THEMES.map((t, i) => {
        const showRole = i === 0 || THEMES[i - 1].role !== t.role;
        const a = Math.min(t.low, t.high);
        const b = Math.max(t.low, t.high);
        return (
          <div key={t.name}>
            {showRole && (
              <div className={`role-head role-${t.role}`}>
                <i className="dot" />
                <strong>{ROLES[t.role].title}</strong>
                <span className="muted">{ROLES[t.role].note}</span>
              </div>
            )}
            <div className="dumbbell-row">
              <span className={`row-label ${t.gap > 20 ? "strong" : ""}`}>{t.name}</span>
              <div className="track">
                <div className="connector" style={{ left: pct(a, SCALE), width: pct(b - a, SCALE) }} />
                <span className="marker high" style={{ left: pct(t.high, SCALE) }} title={`4–5★: ${t.high}%`} />
                <span className="marker low" style={{ left: pct(t.low, SCALE) }} title={`1–2★: ${t.low}%`} />
              </div>
              <span className="row-value">{signed(t.gap)}</span>
            </div>
          </div>
        );
      })}
      <Axis ticks={["0%", "10%", "20%", "30%", "40%"]} left={210} right={72} unit="gap" />
    </figure>
  );
}

// Fig. 02: the "breaks" gap for every product (notebook 2.6b)
export function BreaksByProduct() {
  const SCALE = 40;
  return (
    <figure className="chart-card" aria-label="Breaking gap for each of the 17 products">
      <div className="lollipops">
        <div className="zero-line" />
        {BREAKS_BY_PRODUCT.map((p) => (
          <div className="lollipop-row" key={p.name}>
            <span className="row-label wide">
              {p.name}
              {p.tracker && <span className="tag">tracker</span>}
            </span>
            <div className="track bare">
              <div className="stem" style={{ width: pct(p.gap, SCALE) }} />
              <span className="marker low small" style={{ left: pct(p.gap, SCALE) }} title={`${p.name}: +${p.gap} pts`} />
            </div>
            <span className="row-value small">+{Math.round(p.gap)}</span>
          </div>
        ))}
      </div>
      <Axis ticks={["0", "10", "20", "30", "40"]} left={250} right={52} unit="pts" />
    </figure>
  );
}

// Fig. 03: what reviews punish or praise vs what listings promise (notebook 2.11)
export function ReviewsVsListings() {
  const MIN = -10;
  const MAX = 25;
  const span = MAX - MIN;
  const zero = pct(-MIN, span);
  return (
    <figure className="chart-card" aria-label="Review gap for each theme next to how often listings mention it">
      <Legend
        items={[
          { label: "Regret driver", className: "low" },
          { label: "Neutral", className: "neutral" },
          { label: "Love driver", className: "high" },
        ]}
      />
      <div className="two-panel">
        <div>
          <span className="panel-title">What reviews punish or praise</span>
          <div className="bars">
            {THEMES.map((t) => (
              <div className="bar-row" key={t.name}>
                <span className="row-label narrow">{t.name}</span>
                <div className="track bare">
                  <div className="axis-zero" style={{ left: zero }} />
                  <div
                    className={`bar role-${t.role} ${t.gap >= 0 ? "pos" : "neg"}`}
                    style={{ left: t.gap >= 0 ? zero : pct(t.gap - MIN, span), width: pct(Math.abs(t.gap), span) }}
                    title={`${signed(t.gap)} pts`}
                  />
                </div>
                <span className="row-value small">{signed(t.gap)}</span>
              </div>
            ))}
          </div>
          <div className="axis" aria-hidden="true" style={{ gap: 16 }}>
            <span style={{ width: 190 }} />
            <div className="axis-ticks positioned">
              <span style={{ left: 0 }}>−10</span>
              <span style={{ left: zero, transform: "translateX(-50%)" }}>0</span>
              <span style={{ left: pct(20, span), transform: "translateX(-50%)" }}>+10</span>
              <span style={{ right: 0 }}>+25</span>
            </div>
            <span className="axis-unit" style={{ width: 48 }}>
              pts
            </span>
          </div>
        </div>
        <div>
          <span className="panel-title">What listings promise</span>
          <div className="bars">
            {THEMES.map((t) => (
              <div className="bar-row" key={t.name}>
                <div className="track bare">
                  <div className="axis-zero" style={{ left: 0 }} />
                  <div className={`bar role-${t.role} pos`} style={{ left: 0, width: pct(t.listing, 50) }} title={`${t.listing}% of bullets`} />
                </div>
                <span className="row-value small">{t.listing}%</span>
              </div>
            ))}
          </div>
          <Axis ticks={["0%", "25%", "50%"]} left={0} right={40} unit="" gap={16} />
        </div>
      </div>
    </figure>
  );
}
