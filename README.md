# Irvington Model United Nations — website

Static site for the Model UN program at Irvington High School, Fremont CA.
Plain HTML, CSS and JavaScript. **No build step, no frameworks, no npm.** What
is in this folder is exactly what gets served.

```
index.html          Home — photo-led, minimal
about.html          About Us — what MUN is, the club, the stats
conferences.html    Conferences
officers.html       Officer Team
styles.css          All styling
main.js             All behaviour + the editable site data
assets/             Images
.nojekyll           Tells GitHub Pages not to run Jekyll
```

---

## Editing the content

Almost everything you will want to change lives in **one place**: the
`SITE_DATA` object at the very top of `main.js`, under the banner that reads
`██ EDIT HERE ██`. You do not need to touch the HTML to add a conference, an
officer, or a statistic.

Anything not yet known should stay as the string `"TBD"` (or `null` for a
number). The page renders that honestly rather than inventing something.

### Stat numbers (home page)

```js
stats: [
  { label: 'Delegates',            value: null, suffix: '+' },
  { label: 'Conferences Attended', value: null, suffix: ''  },
  ...
]
```

- `value` — a whole number. The figure counts up from zero when the row
  scrolls into view.
- `value: null` — displays **TBD** and skips the animation. This is the
  current state for all four.
- `suffix` — optional; shown in blue after the number, e.g. `'+'`.

To publish real figures, just replace each `null` with a number:

```js
{ label: 'Delegates', value: 48, suffix: '+' },
```

### Conferences

Two separate arrays.

**Upcoming** — drives the timeline:

```js
upcomingConferences: [
  {
    name: 'BearMUN',
    date: 'December 5–6, 2026',
    location: 'UC Berkeley',
    committees: ['UNSC', 'DISEC', 'Historical Crisis'],
    status: 'registered'
  }
]
```

`status` must be one of exactly three values:

| value          | chip shown          | meaning              |
| -------------- | ------------------- | -------------------- |
| `'registered'` | Registered          | we are going         |
| `'open'`       | Applications Open   | sign-ups are running |
| `'tbd'`        | TBD                 | not confirmed yet    |

Entries render top to bottom exactly as listed, so keep them in date order.

**Past** — drives the archive grid, grouped by **season** (school year), not
calendar year. A MUN season runs autumn to spring, so a calendar year would
cut it in half:

```js
pastConferences: [
  {
    name: 'BearMUN',
    season: '2025–26',
    awards: ['Best Large Delegation'],
    photo: 'assets/team-bearmun.jpg?v=2',
    photoAlt: 'Irvington delegates at BearMUN 2025.',
    photoW: 2200, photoH: 1650,
    link: 'https://example.com',        // optional
    linkLabel: 'Visit the site'         // optional
  }
]
```

- `awards: ['TBD']` means *not filled in yet*. `awards: []` renders
  **"No awards recorded"**, which is a positive claim that none were won —
  only use it when that is actually true.
- `photo: null` renders the styled placeholder box, which looks deliberate.
- `link` / `linkLabel` add a button to the card. FREMUNC has one, currently
  pointing at `TBD`.
- The year filter chips are generated from the `season` values, **and the
  whole filter bar hides itself while only one season exists** — it will
  appear on its own once you add a second.

### Officers

Two arrays work together. `officerGroups` sets the section order and headings:

```js
officerGroups: [
  { key: 'exec',       title: 'Executive Board' },
  { key: 'captains',   title: 'Committee Captains' },
  { key: 'conference', title: 'Conference Leadership' },
  { key: 'junior',     title: 'Junior Officers' },
  { key: 'middle',     title: 'Middle School MUN' }
]
```

`officers` lists the people, each pointing at one of those keys:

```js
{ group: 'exec', name: 'Sonia Puri', role: 'President',
  grade: 'TBD', bio: 'TBD', photo: null }
```

- Adding a whole new section is two edits: a row in `officerGroups`, then
  `group: '<your-key>'` on the people in it.
- `grade` and `bio` are **hidden while they still say TBD**, so a card with
  nothing filled in shows just the name and role rather than a wall of
  placeholders. Type a real value and it appears.
- `photo: null` falls back to an initials tile on a dark blue gradient.
  Initials come from `name` — "Sonia Puri" becomes SP.
- One person can appear twice if they hold two posts. Utkarsh Sinha is
  currently listed as both Vice President and Captain of Crisis; delete
  whichever entry is redundant if he should only show once.

### Adding photos

Drop files into `assets/` and reference them as `assets/your-file.jpg`.
Two things to keep in mind:

- **Always write real alt text.** It is the `photoAlt` field, and it should
  describe what is actually in the frame.
- Resize large photos before committing. Anything over ~1600px wide is
  wasted on a web page and slows the site down.

### Things that are still TBD

Search the project for `TBD` to find everything awaiting real content. As of
writing that includes: dues, the founding year, **the
FREMUNC site URL** (its archive card has a link button ready but suppressed
while it reads TBD), all four stat figures, every officer's grade and bio, and the
conference entries.

Already filled in: meetings are Mondays at lunch and travel team Mondays after
school, both in **room 223**; the advisor is Mr. Belmonte; the club email is
mun.irvington@gmail.com; and Instagram is
[@irvingtonmun](https://www.instagram.com/irvingtonmun/). Those appear in the footer of all
four pages, in the About prose, on the Weekly Meetings card, and in the home
page's closing call to action — so if any of it changes, grep for it rather
than editing one spot.

The BearMUN 2025 delegation photo and the club emblem are both real and in
place — `assets/team-bearmun.jpg` and `assets/imun-logo.png`.

### Before you go live

Open each HTML file and replace `https://TBD.github.io/irvington-mun-web` in
the `<head>` with the real site address. That address is used by the
`canonical`, Open Graph and Twitter tags — the ones that build the preview card
when someone shares a link. They need absolute URLs to work.

---

## Running it locally

You can open `index.html` straight from Finder, but the pages talk to each
other, so a tiny local server behaves more like the real thing:

```bash
python3 -m http.server 4177
```

Then visit <http://localhost:4177>. Press `Ctrl+C` to stop it.

---

## Deploying to GitHub Pages

First time only:

```bash
git init
git add .
git commit -m "Initial commit: Irvington MUN site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Then on github.com, in your repository:

1. **Settings** → **Pages**
2. Under **Source**, choose **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → **Save**

Give it a minute or two; the site appears at
`https://YOUR-USERNAME.github.io/YOUR-REPO/`.

Every later change is just:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Pages redeploys on its own within a minute or so.

### Notes

- **`.nojekyll` must stay.** Without it GitHub runs the files through Jekyll,
  which ignores any folder starting with an underscore. It is an empty file
  and it is doing real work.
- If a change does not show up, it is almost always browser cache. Hard-reload
  with `Cmd+Shift+R`. The `?v=` numbers on the CSS and JS links exist for this
  reason — bump them if you make a big change and want to force everyone's
  browser to fetch fresh copies.

---

## How the code is organised

Typefaces are **Instrument Serif** (headings) and **Space Grotesk** (body).
Instrument Serif ships in a single weight, so every display rule sits at 400 —
asking for 500 or 600 would make the browser fake a bold and smear the
high-contrast strokes. If you change the display face to one with a real
weight range, that constraint goes away.

**`styles.css`** is one file with a numbered table of contents at the top.
Section 01 holds the design tokens — colours, type scale, spacing. Change a
value there and it propagates everywhere. Avoid hard-coding hex values further
down.

Two accent blues exist on purpose:

- `--c-accent` (`#2D6BFF`) — the brand blue, for shapes, rules, borders,
  button fills.
- `--c-accent-text` (`#4D80FF`) — a lighter variant for **words**.

The brand blue measures 4.37:1 against the near-black background, which is
fine for graphics but under the 4.5:1 that text needs. Keep the split.

**`main.js`** is `SITE_DATA` followed by nine small numbered modules. Every
module bails out immediately if the page does not contain its elements, so the
same file is safe to load on all three pages.

**Motion** respects `prefers-reduced-motion` throughout. If a visitor has
"Reduce Motion" enabled in their OS settings, every animation on the site
resolves to its finished state with no movement.
