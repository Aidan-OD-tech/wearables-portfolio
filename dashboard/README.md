# Specs or wearability? Dashboard

Streamlit dashboard for my DESIGNTK 530 midterm (Aidan O'Driscoll). It shows how often 10 themes come up in 1–2★ vs 4–5★ Amazon reviews of 17 fitness trackers and smartwatches. You can filter by device type and product, and read the reviews behind each theme.

It uses the same cleaning (notebook 2.2) and theme keywords (notebook 2.5) as my notebook, so the numbers match it.

## Files

| File | What it is |
|---|---|
| `app.py` | The dashboard |
| `wearable_reviews_sample.csv` | The review sample from my data pull (4,098 rows; the app drops the Gear IconX earbuds, leaving 3,858) |
| `requirements.txt` | Package versions I tested with |
| `.streamlit/config.toml` | Colors and fonts, matched to my portfolio page |

## Run it on your computer

```
pip install -r requirements.txt
streamlit run app.py
```

It opens at http://localhost:8501.

## Put it online (Streamlit Community Cloud)

1. Push this folder to a public GitHub repo.
2. Go to share.streamlit.io, sign in with GitHub, and click **Create app**.
3. Pick the repo and branch, and set the main file path to `dashboard/app.py` (or `app.py` if this folder is the repo root).
4. To embed it in a web page, add `?embed=true` to the app's URL.

Apps on the free tier go to sleep when nobody visits for a while. Open the link once before presenting so it's awake.

## Data

Amazon Reviews 2023, McAuley Lab, UC San Diego (https://amazon-reviews-2023.github.io/), Cell Phones & Accessories and Electronics categories. Reviewer IDs are hashed. The dashboard hides any email address that appears in a review's text.
