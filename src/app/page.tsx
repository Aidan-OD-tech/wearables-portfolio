import { BreaksByProduct, ReviewsVsListings, ThemeGaps } from "@/components/Charts";
import { LINKS, QUOTES } from "@/data/content";

const NAV = [
  { label: "Question", href: "#question" },
  { label: "Findings", href: "#findings" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "A/B test", href: "#ab-test" },
  { label: "Takeaways", href: "#takeaways" },
];

function Hole({ size = 12 }: { size?: number }) {
  return <span className="hole" style={{ width: size, height: size }} aria-hidden="true" />;
}

function Section({ id, label, title, intro, children }: { id: string; label: string; title: React.ReactNode; intro?: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="section">
      <div className="section-label">{label}</div>
      <div className="section-head">
        <h2>{title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function Quote({ text, source, tone }: { text: string; source: string; tone: "low" | "high" }) {
  return (
    <figure className={`quote quote-${tone}`}>
      <blockquote>“{text}”</blockquote>
      <figcaption>
        <i className={`dot ${tone}`} />
        {source}
      </figcaption>
    </figure>
  );
}

function FileLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!href) return <span className="link-pending">{children} (coming soon)</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

function Walkthrough() {
  const url = LINKS.walkthrough;
  if (!url) {
    return (
      <div className="video placeholder">
        <span className="play" aria-hidden="true" />
        <span className="video-note">Walkthrough video coming soon</span>
      </div>
    );
  }
  if (url.endsWith(".mp4")) {
    return <video className="video" src={url} controls preload="metadata" />;
  }
  return <iframe className="video" src={url} title="Walkthrough video" allow="fullscreen; picture-in-picture" allowFullScreen />;
}

export default function Home() {
  return (
    <>
      <header className="masthead">
        <div className="masthead-inner">
          <div className="byline">
            <strong>Aidan O&apos;Driscoll</strong>
            <span className="mono muted small">Industrial design</span>
          </div>
          <nav aria-label="On this page">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                <Hole size={10} />
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="mono muted small">A data story about fitness trackers and smartwatches</div>
          <h1>Specs or wearability?</h1>
          <p className="lede">
            Specs and comfort earn the 5 stars. Durability decides the 1 stars. What 3,858 reviews of 17 trackers and
            smartwatches say.
          </p>
          <div className="strap" aria-hidden="true">
            <div className="buckle">
              <div className="prong" />
            </div>
            <div className="band">
              {Array.from({ length: 7 }, (_, i) => (
                <Hole key={i} size={14} />
              ))}
            </div>
          </div>
          <div className="stats">
            <span><b>17</b> products</span>
            <span><b>3,858</b> reviews</span>
            <span><b>10</b> themes</span>
            <span className="scroll-cue mono small">Scroll to read ↓</span>
          </div>
          <div className="facts">
            <div><span className="mono muted small">Role</span>Research, analysis, design</div>
            <div><span className="mono muted small">Tools</span>Python · pandas · Colab · Streamlit · Next.js</div>
            <div><span className="mono muted small">Course</span>DESIGNTK 530 · Fall 2026</div>
          </div>
        </section>

        {/* 01 · The question */}
        <Section id="question" label="01 · The question" title="Wearables are sold on specs. Is that what decides whether people love them?">
          <div className="content-col stack-lg">
            <div className="card">
              <span className="eyebrow">MAIN QUESTION</span>
              <p className="big">
                Which experiences separate highly rated fitness trackers and smartwatches from poorly rated ones:{" "}
                <strong>everyday wearability</strong> (fit, comfort, materials, battery, reliability) or <strong>technical capability</strong>{" "}
                (accuracy, sensors, smart features)?
              </p>
            </div>
            <div>
              <span className="eyebrow">SUPPORTING QUESTIONS</span>
              <ol className="numbered">
                <li>How often do 1–2★ and 4–5★ reviews of the same products mention wearability themes compared with technical themes?</li>
                <li>Which single theme shows the biggest gap between low and high ratings?</li>
                <li>Do fitness trackers and smartwatches differ?</li>
                <li>Do product listings lead with technical features more than wearability?</li>
              </ol>
            </div>
            <div className="grid-2">
              <div className="card dashed">
                <span className="eyebrow">WHO IT&apos;S FOR</span>
                <p>Industrial designers, wearable product teams and product managers deciding where design effort goes: straps, materials, fit and charging, or the next sensor.</p>
              </div>
              <div className="card dashed">
                <span className="eyebrow">WHAT I EXPECTED</span>
                <p>Wearability would separate low and high ratings more than technical capability. I&apos;d change my mind if accuracy or features showed the biggest gap.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* 02 · The data */}
        <Section
          id="data"
          label="02 · The data"
          title="Same products, opposite reviews."
          intro="I took written reviews of 17 trackers and smartwatches from Amazon Reviews 2023 (McAuley Lab, UC San Diego). For each product I sampled the same number of 1–2★ and 4–5★ reviews, then coded every review for 10 themes in two families."
        >
          <div className="full method">
            <div className="method-step">
              <span className="mono huge">17</span>
              <strong>products</strong>
              <span className="muted">12 smartwatches, 5 trackers</span>
            </div>
            <div className="arrow" aria-hidden="true">→</div>
            <div className="method-step">
              <div className="pill-stat"><i className="dot low" /><b className="mono">1,929</b> reviews at 1–2★</div>
              <div className="pill-stat"><i className="dot high" /><b className="mono">1,929</b> reviews at 4–5★</div>
            </div>
            <div className="arrow" aria-hidden="true">→</div>
            <div className="method-step">
              <span className="eyebrow">EVERYDAY WEARABILITY</span>
              <div className="chips">
                {["Fit & comfort", "Skin irritation", "Strap & materials", "Battery life", "Charging", "Breaks or stops working"].map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
              <span className="eyebrow">TECHNICAL CAPABILITY</span>
              <div className="chips">
                {["Tracking accuracy", "Health sensors", "Smart features", "App & syncing"].map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="content-col footnote">
            Balanced by design, so this compares what people say, not how common low ratings are. Reviews run up to September 2023. A
            theme counts once per review, whether it&apos;s praise or complaint, so I always compare low with high.
          </p>
        </Section>

        {/* 03 · Fig. 01 */}
        <Section id="findings" label="03 · Fig. 01" title="One theme separates them: it broke." intro="Share of reviews that mention each theme. 1,929 reviews in each group, from the same 17 products.">
          <div className="full">
            <ThemeGaps />
          </div>
          <div className="full grid-3">
            <div className="takeaway"><strong>Breaking</strong><p>29% of low reviews vs 6% of high. The biggest gap by far, and higher in low reviews for all 17 products.</p></div>
            <div className="takeaway"><strong>Accuracy</strong><p>16% vs 15%. People mention it whether they&apos;re happy or not, so it barely separates the groups.</p></div>
            <div className="takeaway"><strong>Comfort and battery</strong><p>Show up more in happy reviews. When a wearable is comfortable and lasts, people say so.</p></div>
          </div>
        </Section>

        {/* 04 · Fig. 02 */}
        <Section
          id="devices"
          label="04 · Fig. 02"
          title="It's not one bad device."
          intro="The breaking gap for each product: % of its 1–2★ reviews minus % of its 4–5★ reviews that say it broke or stopped working."
        >
          <div className="fig2">
            <BreaksByProduct />
            <div className="stack">
              <div className="card dark">
                <span className="eyebrow">WHEN IT FAILS</span>
                <span className="mono stat-big">94%</span>
                <p>of failures that give a date happen in the first year, mostly inside a typical warranty.</p>
                <p className="small soft">238 of 552 low &quot;breaks&quot; reviews say when. 69% fall within six months.</p>
              </div>
              <div className="card dashed kv">
                <div><span>Trackers</span><b className="mono">+26 pts</b></div>
                <div><span>Smartwatches</span><b className="mono">+21 pts</b></div>
                <div><span>Name brands</span><b className="mono">+24 pts</b></div>
                <div><span>Budget brands</span><b className="mono">+17 pts</b></div>
              </div>
            </div>
          </div>
        </Section>

        {/* 05 · In their words */}
        <Section
          id="words"
          label="05 · In their words"
          title="“It worked, then it didn't.”"
          intro="The most common story in low reviews: a device that was fine at first, then stopped charging, froze or fell apart. Happy reviewers talk about value and comfort, and shrug off accuracy."
        >
          <div className="full grid-3">
            {QUOTES.low.map((q) => (
              <Quote key={q.source} {...q} tone="low" />
            ))}
          </div>
          <div className="full grid-2">
            {QUOTES.high.map((q) => (
              <Quote key={q.source} {...q} tone="high" />
            ))}
          </div>
          <p className="content-col footnote">
            From a random reading sample of 30 low and 30 high reviews. 14 of the 30 low reviews describe a device that worked, then
            failed. Keywords flagged only 8 of those, so the &quot;breaks&quot; count is probably conservative.
          </p>
        </Section>

        {/* 06 · How my answer changed */}
        <Section id="changed" label="06 · How my answer changed" title="I expected wearability. It's whether it keeps working.">
          <div className="content-col grid-2">
            <div className="card dashed">
              <span className="eyebrow">BEFORE</span>
              <p className="big">Wearability themes would separate low and high reviews more than technical ones.</p>
            </div>
            <div className="card dark">
              <span className="eyebrow">AFTER</span>
              <p className="big">Neither family as a whole. Wearability only &quot;wins&quot; because of breaking. Specs and comfort earn the 5 stars; durability decides the 1 stars.</p>
            </div>
          </div>
          <div className="content-col">
            <span className="eyebrow">HOW I CHECKED IT</span>
            <div className="grid-4">
              <div className="card check"><strong>Matched for review length</strong><span className="mono">+20.8</span><p>Breaking is still #1 (was +22.5). Low reviews are longer, so I compared reviews of similar length.</p></div>
              <div className="card check"><strong>Stricter word list</strong><span className="mono">+17.0</span><p>Breaking without words like warranty, replacement and dead.</p></div>
              <div className="card check"><strong>Wearability without breaking</strong><span className="mono">39% vs 41%</span><p>Low vs high reviews. Leave breaking out and it&apos;s a tie.</p></div>
              <div className="card check"><strong>App &amp; syncing</strong><span className="mono">+7.3 → +1.8</span><p>Most of this gap was review length, so I don&apos;t claim it.</p></div>
            </div>
          </div>
          <div className="content-col pushback">
            <span className="eyebrow">WHAT PUSHES BACK</span>
            <p>
              Happy reviews are often first impressions. &quot;So far&quot; shows up in 7% of high reviews vs 1% of low ones, so some of
              today&apos;s 5★ devices may fail later. And accuracy does sink some reviews: “heart rate tracking is terrible… up to 40%
              off” <span className="mono muted small">(2★ · Xiaomi Mi Band 6 · R03351)</span>.
            </p>
          </div>
        </Section>

        {/* 07 · Dashboard */}
        <Section
          id="dashboard"
          label="07 · Dashboard"
          title="Explore it yourself."
          intro="Filter by device type or product, see how often each theme comes up in low and high reviews, and read the reviews behind it."
        >
          <div className="dashboard">
            <iframe src={`${LINKS.dashboard}?embed=true`} title="Specs or wearability? Streamlit dashboard" />
          </div>
          <div className="full dashboard-foot">
            <span className="muted">Filters change the charts. Numbers in the story above are for all 17 products.</span>
            <a className="mono small" href={LINKS.dashboard} target="_blank" rel="noreferrer">
              Open full screen ↗
            </a>
          </div>
        </Section>

        {/* 08 · Fig. 03 */}
        <Section
          id="listings"
          label="08 · Fig. 03"
          title="Listings sell what people already love."
          intro="Left: how much more each theme shows up in 1–2★ than in 4–5★ reviews. Right: the share of listing feature bullets that mention it (96 bullets from 16 listings)."
        >
          <div className="full">
            <ReviewsVsListings />
          </div>
          <div className="content-col grid-2">
            <div className="takeaway"><strong>Almost nothing promises it will last</strong><p>2 of 96 bullets, and only one of those is real: Apple&apos;s warranty line. Breaking is the biggest regret driver.</p></div>
            <div className="takeaway"><strong>The app is promised most</strong><p>45% of bullets mention it, and low reviews mention it more too, though that gap shrank once I matched review length.</p></div>
          </div>
        </Section>

        {/* 09 · What I'd test */}
        <Section
          id="ab-test"
          label="09 · What I'd test"
          title="Check in before people give up."
          intro="If a device fails early, I think people give up because getting it fixed feels like a hassle. If the brand checks in first and makes the fix easy, more people should end up with a device they keep wearing."
        >
          <div className="full ab">
            <div className="card">
              <span className="eyebrow">A · BASELINE</span>
              <p className="big">The current app. Support and warranty info lives in settings.</p>
            </div>
            <div className="card dark">
              <span className="eyebrow">B · CHECK-IN</span>
              <p className="big">
                The same app, plus a check-in at day 30 and day 90: “Is your device working the way it should?” Tapping <strong>No</strong>{" "}
                opens a quick troubleshooting step and a one-tap replacement request.
              </p>
            </div>
            <p className="prediction">
              <span className="eyebrow">PREDICTION</span>
              We expect that adding an early check-in will lead to more people still wearing their device at day 180, because people with a
              failing unit will get it fixed or replaced instead of giving up on it.
            </p>
            <div className="ab-facts">
              <div><span className="eyebrow">WHO</span>New US owners, randomly split 50/50 at setup over 8 weeks</div>
              <div><span className="eyebrow">MAIN MEASURE</span>Still wearing it at day 180 (wrist data in days 166–180)</div>
              <div><span className="eyebrow">ADOPT B IF</span>It lifts that share by 2 percentage points or more</div>
              <div><span className="eyebrow">WATCH FOR</span>Replacement requests per 100 people</div>
            </div>
          </div>
        </Section>

        {/* 10 · Takeaways and what's next */}
        <Section id="takeaways" label="10 · Takeaways" title="What I'd tell a design team, and what I'd do next.">
          <div className="full grid-3">
            <div className="takeaway big-num"><span className="mono">01</span><strong>Durability decides the 1 stars.</strong><p>Breaking or stopping working is the one gap that held for every product, both device types and every check I ran.</p></div>
            <div className="takeaway big-num"><span className="mono">02</span><strong>Specs and comfort earn the 5 stars.</strong><p>Comfort, battery, sensors and smart features come up more in happy reviews. Accuracy barely moves either way.</p></div>
            <div className="takeaway big-num"><span className="mono">03</span><strong>Design for the first year, not the unboxing.</strong><p>94% of dated failures happen in year one, and listings almost never promise a device will last. What happens after a failure is something the team controls.</p></div>
          </div>
          <div className="content-col grid-2 notes">
            <div>
              <span className="eyebrow">WHAT THIS CAN&apos;T TELL ME</span>
              <ul className="plain">
                <li><strong>Reviewers, not owners.</strong> Written Amazon reviews skew toward people motivated to write.</li>
                <li><strong>Happy reviews come early.</strong> I can&apos;t follow anyone over time, so some 5★ devices may fail later.</li>
                <li><strong>Mentions, not feelings.</strong> Keywords count a theme whether it&apos;s praise or complaint, and 17 products is a pattern, not a rule.</li>
              </ul>
            </div>
            <div>
              <span className="eyebrow">WHAT&apos;S NEXT</span>
              <ol className="numbered tight">
                <li><span><strong>Follow owners past the first few months.</strong> Later reviews, or warranty and return data from a brand, would show what the early 5★ reviews miss.</span></li>
                <li><span><strong>Test the listing itself.</strong> Promise the support the check-in makes real, instead of leading with another spec.</span></li>
              </ol>
            </div>
          </div>
        </Section>

        {/* 11 · Walkthrough */}
        <Section id="walkthrough" label="11 · Walkthrough" title="Walkthrough." intro="A screen-recorded tour of the questions, findings and dashboard.">
          <div className="full">
            <Walkthrough />
          </div>
        </Section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="strap-tip" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Hole key={i} />
            ))}
          </div>
          <div className="footer-row">
            <div className="byline-stack">
              <strong>Aidan O&apos;Driscoll</strong>
              <span className="muted">Specs or wearability? · DESIGNTK 530 · Fall 2026</span>
            </div>
            <nav aria-label="Project files" className="mono small">
              <FileLink href={LINKS.notebook}>Notebook (.ipynb)</FileLink>
              <FileLink href={LINKS.colab}>Colab</FileLink>
              <FileLink href={LINKS.github}>GitHub</FileLink>
              <FileLink href={LINKS.dashboard}>Dashboard, full screen</FileLink>
              <FileLink href={LINKS.data}>Data: Amazon Reviews 2023</FileLink>
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
