# The human body

An atlas of adult anatomy, female and male, anterior and posterior. It is a static site: HTML, CSS, and JavaScript, with no application server. Filter by organ system, and switch sex and aspect from the header.

Dexter is the right side of the body and sinister is the left. On the anterior aspect, dexter is at the left of the plate. On the posterior aspect, the plate is mirrored and dexter is at the right.

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8765
```

Then visit `http://127.0.0.1:8765`.

## A domain, still with no backend

Any static host works: Cloudflare Pages, Netlify, GitHub Pages, or an S3 bucket behind a CDN. Point the domain’s DNS at that host. The site does not need a database, a build step, or a runtime.

Deep links look like `#female/heart` or `#male/kidney/patient-right`.

## Ads

Side rails are normal browser ad slots. The network’s script runs in the page; nothing has to be rendered on a server.

- `left` and `right` fit a 160×600 skyscraper when the window is wide enough that the rails do not crush the plates.
- `bottom` fits a 728×90 banner when the window is narrower. The rails hide there so the bodies stay readable.

Slots are labeled and empty until you paste a unit. The hook is `js/ads.js`. After the network approves the site, add its script tag to `index.html` and follow the comment in `js/ads.js` to fill `[data-ad-slot="left"]`, `[data-ad-slot="right"]`, and `[data-ad-slot="bottom"]`.

## Keyboard

- `/` focuses search
- Esc steps back from an enlargement, then clears the selection
- Double-click a system to view it alone
