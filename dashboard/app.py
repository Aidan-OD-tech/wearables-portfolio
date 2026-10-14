"""Specs or wearability? A dashboard for my DESIGNTK 530 midterm (Aidan O'Driscoll).

It uses the same cleaning (notebook 2.2) and theme keywords (notebook 2.5) as my notebook,
so every number here matches it.

Run it:  pip install -r requirements.txt
         streamlit run app.py
"""
import html
import re
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

st.set_page_config(page_title="Specs or wearability? Dashboard", page_icon="⌚", layout="wide")

HERE = Path(__file__).parent

# Colors: the same two for low and high reviews in every chart, plus the page's neutrals
LOW, HIGH = "#e34948", "#2a78d6"
INK, INK2, MUTED = "#22211F", "#3E3C38", "#5F5C56"
BG, CARD, TRACK, LINE = "#FBFAF8", "#F2EFEA", "#E6E2DB", "#CFCAC1"

# ---------- Data: same cleaning as notebook 2.2 ----------
NOT_WEARABLE = ["B01H3EEOD4"]  # Samsung Gear IconX: earbuds, not a wrist wearable

SHORT_NAMES = {
    "B00NWXM5U0": "Fitbit Charge", "B00BGO0QEO": "Fitbit Flex", "B08GLRVD95": "Fitbit Sense",
    "B091KPMFXJ": "Xiaomi Mi Band 6", "B0BC3X6ZQ4": "Xiaomi Band 7 Pro", "B07N2CH1S5": "YoYoFit Fitness Watch",
    "B07CRSK5DM": "Amazfit Bip", "B0BJW6R4YX": "Amazfit Bip U Pro", "B0B5WDRB5K": "Popglory Smart Watch",
    "B07M87KRKR": "Garmin Vivoactive 3 Music", "B01BKUB6BA": "Garmin Vivoactive HR", "B08L4V3PNJ": "Garmin Vivoactive 4S",
    "B07R5VHKKZ": "Garmin Forerunner 35", "B0BLD1HN66": "Samsung Galaxy Watch 4", "B09RL7NM59": "Apple Watch Series 7",
    "B08MVYQTRR": "AGPTEK Smart Watch", "B0BJZNZQY7": "Fitpolo Smart Watch",
}

# Theme keywords, copied from notebook 2.5. Listed in the order of the overall gap (Fig. 01).
THEMES = {
    "Breaks or stops working": r"stopped working|stop working|quit working|stops working|\bdied\b|\bdead\b|\bbroke\b|\bbroken\b|fell (?:off|apart)|defective|malfunction\w*|won'?t turn on|cracked|warranty|replacement",
    "App & syncing":       r"\bapps?\b|\bsync\w*|bluetooth|\bpair\w*|\bconnect\w*|disconnect\w*|\bupdates?\b|firmware|software",
    "Charging":            r"charger|charging|recharg\w*|\bcharges?\b(?<!fitbit charge)(?! hr| \d)|charge cable|charge it",
    "Strap & materials":   r"\bstraps?\b|\bclasp\b|\bbuckle\b|(?:replacement|new|watch|silicone|rubber|leather|metal|sport|extra|wrist) ?bands?\b|\bband (?:broke|snapped|tore|ripped|cracked|came)|silicone|rubber|plastic|\bmaterials?\b",
    "Skin irritation":     r"\brash\w*|irritat\w*|\bitch\w*|allerg\w*|blister\w*|\bskin\b|burn\w* (?:my |on my )?(?:wrist|skin|arm)|red marks?",
    "Tracking accuracy":   r"accura\w*|inaccura\w*|incorrect\w*|\boff by\b|miscount\w*|overcount\w*|undercount\w*|precis\w*",
    "Smart features":      r"notification\w*|\bnotify\b|\btexts?\b|\bcalls?\b|messages?|\bmusic\b|alexa|assistant|siri|\bpay\b|payment|watch ?faces?|weather",
    "Health sensors":      r"heart rate|\bhr\b|\bbpm\b|\bpulse\b|spo2|oxygen|blood pressure|\becg\b|\bsleep\b|\bsteps?\b|pedometer|calorie\w*|\bgps\b",
    "Fit & comfort":       r"\bcomfort\w*|uncomfortable|\bfits\b|\bfit (?:my|on|around|well|nicely|perfectly|great|comfortably|snug)|(?:good|great|perfect|poor|bad|snug|loose|tight) fit|too (?:big|small|bulky|heavy|tight|loose)|\bbulky\b|lightweight|(?:too|bit|very|feels?|is) (?:tight|loose)",
    "Battery life":        r"battery|hold (?:a |its )?charge|lasts? (?:\w+ )?days?|days? (?:on|per) (?:a )?charge",
}
WEARABILITY = ["Fit & comfort", "Skin irritation", "Strap & materials", "Battery life", "Charging", "Breaks or stops working"]
TECHNICAL = ["Tracking accuracy", "Health sensors", "Smart features", "App & syncing"]


EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")


def clean_text(s):
    s = html.unescape(str(s))
    return s.replace("<br />", " ").replace("<br/>", " ").replace("<br>", " ").strip()


@st.cache_data
def load_reviews():
    reviews = pd.read_csv(HERE / "wearable_reviews_sample.csv", parse_dates=["review_date"])
    reviews = reviews[~reviews["parent_asin"].isin(NOT_WEARABLE)].copy()
    reviews["review_title"] = reviews["review_title"].fillna("").map(clean_text)
    reviews["review_text"] = reviews["review_text"].map(clean_text)
    reviews["stars"] = reviews["rating"].astype(int)
    reviews["low_rating"] = reviews["rating_group"].str.startswith("low")
    reviews["full_text"] = reviews["review_title"] + ". " + reviews["review_text"]
    reviews["shown_text"] = reviews["full_text"].str.replace(EMAIL, "[email removed]", regex=True)  # for display only
    reviews["short_name"] = reviews["parent_asin"].map(SHORT_NAMES)

    text = reviews["full_text"].str.lower()
    for theme, pattern in THEMES.items():
        reviews[theme] = text.str.contains(pattern, regex=True)
    reviews["Any wearability theme"] = reviews[WEARABILITY].any(axis=1)
    reviews["Any technical theme"] = reviews[TECHNICAL].any(axis=1)

    # A fixed shuffle so the review panel shows the same reviews each time
    shuffled = reviews.sample(frac=1, random_state=530).index
    reviews["shuffle"] = pd.Series(range(len(shuffled)), index=shuffled)
    return reviews


reviews = load_reviews()
DEVICE_TYPES = {"All": None, "Trackers": "fitness tracker", "Smartwatches": "smartwatch"}

# ---------- Page styles ----------
st.html(f"""<style>
[data-testid="stMainBlockContainer"] {{ padding-top: 2rem; padding-bottom: 2rem; max-width: 1360px; }}
header[data-testid="stHeader"] {{ background: transparent; }}
.mono {{ font-family: 'DM Mono', monospace; }}
.eyebrow {{ font-family: 'DM Mono', monospace; font-size: 13px; color: {MUTED}; }}
.dash-head {{ display: grid; grid-template-columns: 1.25fr 1fr; gap: 32px; align-items: end; padding-bottom: 20px; border-bottom: 2px dashed #DDD8CF; }}
.dash-head h1 {{ margin: 6px 0 8px; padding: 0; font-size: 40px; line-height: 1.05; font-weight: 700; letter-spacing: -0.03em; color: {INK}; }}
.dash-head p {{ margin: 0; font-size: 16px; line-height: 1.5; color: {INK2}; }}
.answer {{ background: {INK}; color: {BG}; border-radius: 24px; padding: 18px 22px; font-size: 16px; line-height: 1.45; }}
.answer .eyebrow {{ color: #C9C5BD; display: block; padding-bottom: 6px; }}
.counts {{ text-align: right; font-size: 14px; color: {INK2}; line-height: 1.5; padding-bottom: 6px; }}
.counts b {{ font-family: 'DM Mono', monospace; font-weight: 500; color: {INK}; }}
.tiles {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }}
.tile {{ background: {CARD}; border-radius: 24px; padding: 18px 22px; display: flex; flex-direction: column; gap: 6px; }}
.tile .name {{ font-size: 15px; font-weight: 600; color: {INK}; }}
.tile .vals {{ display: flex; align-items: baseline; gap: 18px; font-family: 'DM Mono', monospace; font-size: 26px; color: {INK}; letter-spacing: -0.02em; }}
.tile .vals span {{ display: inline-flex; align-items: center; gap: 8px; }}
.tile .gap {{ margin-left: auto; font-size: 16px; color: {INK2}; }}
.tile .sub {{ font-size: 13px; color: {MUTED}; }}
.dot {{ width: 11px; height: 11px; border-radius: 50%; display: inline-block; flex: none; }}
.panel-title {{ font-size: 18px; font-weight: 600; color: {INK}; margin: 0; }}
.quote {{ background: {CARD}; border-radius: 20px; padding: 12px 16px; margin-bottom: 8px; }}
.quote p {{ margin: 0 0 6px; font-size: 14px; line-height: 1.5; color: {INK}; }}
.quote mark {{ background: #E6DFCF; color: {INK}; border-radius: 3px; padding: 0 1px; }}
.quote .meta {{ display: flex; align-items: center; gap: 8px; font-family: 'DM Mono', monospace; font-size: 12px; color: {MUTED}; }}
.note {{ font-size: 13px; color: {MUTED}; line-height: 1.5; }}
.empty {{ border: 2px dashed {LINE}; border-radius: 24px; padding: 40px; text-align: center; font-size: 17px; color: {INK2}; }}
.fixed {{ border-top: 2px dashed #DDD8CF; padding-top: 18px; display: grid; grid-template-columns: 1.1fr 1fr 1fr 1.4fr; gap: 24px; }}
.fixed .label {{ grid-column: 1 / -1; font-family: 'DM Mono', monospace; font-size: 12px; color: {MUTED}; }}
.fixed div b {{ display: block; font-size: 14px; font-weight: 600; color: {INK}; padding-bottom: 4px; }}
.fixed div {{ font-size: 14px; line-height: 1.5; color: {INK2}; }}
</style>""")

# ---------- 1 · Question and answer ----------
st.html(f"""<div class="dash-head">
  <div>
    <span class="eyebrow">Aidan O'Driscoll · DESIGNTK 530 · Amazon Reviews 2023</span>
    <h1>Specs or wearability?</h1>
    <p>What separates 1–2★ reviews from 4–5★ reviews of the same fitness trackers and smartwatches: everyday wearability (fit, comfort, materials, battery, reliability) or technical capability (accuracy, sensors, smart features)?</p>
  </div>
  <div class="answer"><span class="eyebrow">WHAT I FOUND</span>Neither family as a whole. Whether the device keeps working separates them most. Specs and comfort earn the 5 stars; durability decides the 1 stars.</div>
</div>""")

# ---------- 2 · Filters ----------
f1, f2, f3 = st.columns([1.35, 1.35, 2.3], vertical_alignment="bottom")
with f1:
    device = st.segmented_control("Devices", list(DEVICE_TYPES), default="All", required=True, key="device")
available = sorted(
    reviews.loc[reviews["device_type"].eq(DEVICE_TYPES[device]) if DEVICE_TYPES[device] else slice(None), "short_name"].unique()
)
product_key = f"products_{device}"  # each device type keeps its own product picks
picked_before = st.session_state.get(product_key, available)  # the label is written before the picker
popover_label = (f"Products: all {len(available)}" if len(picked_before) == len(available)
                 else f"Products: {len(picked_before)} of {len(available)}")
with f2:
    with st.popover(popover_label, width="stretch"):
        picked = st.multiselect("Products", available, default=available, key=product_key,
                                placeholder="Pick at least one product")

sel = reviews[reviews["short_name"].isin(picked)]
low, high = sel[sel["low_rating"]], sel[~sel["low_rating"]]

with f3:
    st.html(f"""<div class="counts">Showing <b>{len(low):,}</b> reviews at 1–2★ and <b>{len(high):,}</b> at 4–5★
    from <b>{len(picked)}</b> product{'s' if len(picked) != 1 else ''}<br><span class="note">Same number of low and high reviews per product, by design</span></div>""")

if sel.empty:
    st.html('<div class="empty"><b>No products selected.</b><br>Pick at least one product under Products to see the charts and reviews.</div>')
else:
    # ---------- 3 · Number tiles ----------
    def tile(column, name):
        lo_n, hi_n = int(low[column].sum()), int(high[column].sum())
        # Round the shares first, like the notebook, so the gap matches it (28.6 − 6.1 = +22.5)
        lo_pct, hi_pct = round(lo_n / len(low) * 100, 1), round(hi_n / len(high) * 100, 1)
        return f"""<div class="tile"><span class="name">{name}</span>
          <div class="vals"><span><i class="dot" style="background:{LOW}"></i>{lo_pct:.1f}%</span><span><i class="dot" style="background:{HIGH}"></i>{hi_pct:.1f}%</span>
          <span class="gap">{lo_pct - hi_pct:+.1f} pts</span></div>
          <span class="sub">{lo_n:,} of {len(low):,} low vs {hi_n:,} of {len(high):,} high reviews mention it</span></div>"""

    st.html('<div class="tiles">' + tile("Breaks or stops working", "Breaks or stops working")
            + tile("Any wearability theme", "Any wearability theme") + tile("Any technical theme", "Any technical theme") + "</div>")

    # ---------- 4 · Theme chart and 5 · What people say ----------
    chart_col, quote_col = st.columns([1.85, 1], gap="large")

    with chart_col:
        st.html('<p class="panel-title">How often each theme comes up in low and high reviews</p>')
        themes = list(THEMES)
        lo_rates = [round(low[t].mean() * 100, 1) for t in themes]
        hi_rates = [round(high[t].mean() * 100, 1) for t in themes]
        x_max = max(40, (int(max(lo_rates + hi_rates)) // 10 + 1) * 10)
        labels = [f"<b>{t}</b>" if t == "Breaks or stops working" else t for t in themes]

        fig = go.Figure()
        connector_x, connector_y = [], []
        for lab, lo_r, hi_r in zip(labels, lo_rates, hi_rates):
            connector_x += [hi_r, lo_r, None]
            connector_y += [lab, lab, None]
        fig.add_trace(go.Scatter(x=connector_x, y=connector_y, mode="lines", line=dict(color=LINE, width=2),
                                 hoverinfo="skip", showlegend=False))
        for name, rates, group, color in [("1–2★ reviews", lo_rates, low, LOW), ("4–5★ reviews", hi_rates, high, HIGH)]:
            fig.add_trace(go.Scatter(
                x=rates, y=labels, mode="markers", name=name,
                marker=dict(color=color, size=14, line=dict(color=BG, width=2)),
                customdata=[[int(group[t].sum()), len(group)] for t in themes],
                hovertemplate="%{y}<br>" + name + ": %{x:.1f}% (%{customdata[0]:,} of %{customdata[1]:,})<extra></extra>",
            ))
        for lab, lo_r, hi_r in zip(labels, lo_rates, hi_rates):
            fig.add_annotation(x=1.0, xref="paper", xanchor="left", xshift=14, y=lab, showarrow=False,
                               text=f"{lo_r - hi_r:+.1f}", font=dict(family="DM Mono, monospace", size=13, color=INK))
        fig.add_annotation(x=1.0, xref="paper", xanchor="left", xshift=14, y=1.0, yref="paper", yanchor="bottom",
                           showarrow=False, text="gap", font=dict(size=12, color=MUTED))
        fig.update_layout(
            height=500, margin=dict(l=8, r=64, t=36, b=48),
            paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)",
            font=dict(family="Instrument Sans, system-ui, sans-serif", size=13, color=INK),
            legend=dict(orientation="h", x=0, y=1.0, xanchor="left", yanchor="bottom", font=dict(size=13, color=INK2)),
            hoverlabel=dict(bgcolor=BG, bordercolor=LINE, font=dict(family="Instrument Sans, sans-serif", size=13, color=INK)),
        )
        fig.update_xaxes(range=[0, x_max], ticksuffix="%", gridcolor=TRACK, zeroline=False, showline=False,
                         title=dict(text="Share of reviews that mention the theme (each review counts once)", font=dict(size=13, color=MUTED)),
                         tickfont=dict(family="DM Mono, monospace", size=12, color=MUTED))
        fig.update_yaxes(autorange="reversed", automargin=True, showgrid=False, ticks="", ticksuffix="  ",
                         tickfont=dict(size=14, color=INK))
        st.plotly_chart(fig, theme=None, config={"displayModeBar": False})
        st.html('<p class="note">A theme counts once per review, whether it\'s praise or complaint, so compare red with blue rather than reading either alone. Gap = low minus high, in percentage points.</p>')

    with quote_col:
        st.html('<p class="panel-title">What people say</p>')
        q1, q2 = st.columns([1.5, 1], vertical_alignment="bottom")
        with q1:
            theme = st.selectbox("Theme", list(THEMES), key="quote_theme")
        with q2:
            group = st.segmented_control("Reviews", ["1–2★", "4–5★"], default="1–2★", required=True, key="quote_group")
        pool = (low if group == "1–2★" else high)
        pool = pool[pool[theme]].sort_values("shuffle")
        # Prefer readable lengths first, keep the longest reviews for later pages
        pool = pool.assign(long=pool["full_text"].str.len() > 420).sort_values(["long", "shuffle"])

        signature = (theme, group, tuple(picked))
        if st.session_state.get("quote_signature") != signature:
            st.session_state["quote_signature"] = signature
            st.session_state["quote_offset"] = 0

        def show_more():
            st.session_state["quote_offset"] += 3

        group_n = len(low) if group == "1–2★" else len(high)
        st.html(f'<p class="note">{len(pool):,} of {group_n:,} {group} reviews in this selection mention {html.escape(theme.lower())}.</p>')

        if pool.empty:
            st.html(f'<div class="empty">No {group} reviews in this selection mention {html.escape(theme.lower())}.</div>')
        else:
            offset = st.session_state["quote_offset"] % len(pool)
            shown = pool.iloc[offset:offset + 3]
            pattern = re.compile(THEMES[theme])
            color = LOW if group == "1–2★" else HIGH

            def excerpt(text, width=200):
                """Show the part of the review around the first keyword match, with matches highlighted."""
                first = pattern.search(text.lower())
                start = 0 if not first or first.start() < width // 2 else first.start() - width // 2
                end = min(len(text), start + width)
                window = text[start:end]
                parts, last = [], 0
                for m in pattern.finditer(window.lower()):
                    parts.append(html.escape(window[last:m.start()]))
                    parts.append(f"<mark>{html.escape(window[m.start():m.end()])}</mark>")
                    last = m.end()
                parts.append(html.escape(window[last:]))
                return ("…" if start > 0 else "") + "".join(parts) + ("…" if end < len(text) else "")

            cards = "".join(
                f'<div class="quote"><p>{excerpt(r.shown_text)}</p>'
                f'<div class="meta"><i class="dot" style="background:{color}"></i>{r.stars}★ · {html.escape(r.short_name)} · {r.review_id}</div></div>'
                for r in shown.itertuples()
            )
            st.html(cards)
            if len(pool) > 3:
                st.button("Show 3 more", on_click=show_more, type="tertiary")

# ---------- 6 · Fixed findings ----------
# These come from notebook 2.8 and 2.11 and use all 17 products, so the filters don't change them.
st.html("""<div class="fixed">
  <span class="label">ALL 17 PRODUCTS, 3,858 REVIEWS · THE FILTERS DON'T CHANGE THESE</span>
  <div><b>When it fails</b>94% of failures that give a date happen in the first year (238 of 552 low "breaks" reviews say when).</div>
  <div><b>What listings promise</b>2 of 96 listing feature bullets mention durability. Most promise sensors, smart features and the app.</div>
  <div><b>What it means</b>Design and test for the first year of wear, not just the unboxing.</div>
  <div><b>Limits</b>These are Amazon reviewers, not all owners. A theme counts whether it's praise or complaint, and happy reviews are often written early.</div>
</div>""")
