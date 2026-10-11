# La Cucina Povera — Website

The website for **La Cucina Povera** (`impoverishedkitchen.co.uk`), built with [Astro](https://astro.build) + Vue 3 + TypeScript. Content is managed through [Sveltia CMS](https://github.com/sveltia/sveltia-cms), a Git-based CMS — no database, no server. Every edit you make in the CMS creates a commit directly to this GitHub repo, and GitHub Actions automatically rebuilds and redeploys the site.

---

## Running locally

```bash
# Install dependencies (only needed once, or after pulling changes)
npm install

# Start the dev server — hot-reloads on every file save
npm run dev
```

The site will be at **http://localhost:4321/LaCucinaPovera**

> **Note:** The CMS admin panel (`/admin`) won't work locally — it needs to talk to GitHub. Edit content locally by changing the JSON files in `src/content/` directly (see below).

---

## What you can edit (and where)

All content lives in `src/content/`. You never need to touch any other files.

### Site settings — `src/content/settings/site.json`

| Field | What it does |
|---|---|
| `isOpen` | `true` or `false` — controls the Open/Closed badge in the nav |
| `openStatusText` | Text shown when open, e.g. `"Open today"` |
| `closedStatusText` | Text shown when closed, e.g. `"Closed today"` |
| `openingHours` | Array of day/hours rows shown in the Find Us section and footer |
| `hoursNote` | **This week's note** — shown as a callout under the hours table. Use this for weekend exceptions, e.g. `"Closed this weekend — back Wed 22nd."` Leave blank to hide it. |
| `instagramUrl` | Your Instagram profile URL |
| `facebookUrl` | Your Facebook page URL — leave blank to hide |
| `address` | Your full address |
| `phone` | Phone number |
| `email` | Contact email |
| `storyText` | The paragraph(s) in the "What we are" story section |

### Menu — `src/content/menu/focaccia.json`

Add, remove or edit focaccia sandwich items. Each item has:
- `name` — e.g. `"Sicilian Green"`
- `description` — e.g. `"Mozzarella, pistachio pesto, rocket & hot honey."`
- `price` — e.g. `"£5"`
- `dietary` — e.g. `"v"`, `"vg"`, `"gf"` — leave blank for none

### Photos — `src/content/photos/gallery.json`

Add photos to the gallery. Each entry needs:
- `src` — path to the image, e.g. `/images/my-photo.jpg` (put the image file in `public/images/`)
- `alt` — a description of the photo (important for accessibility and SEO)
- `caption` — optional caption shown in the lightbox

---

## Using the CMS (Sveltia CMS)

Once the site is deployed to GitHub Pages, you can manage all content at:

```
https://nathanasaide.github.io/LaCucinaPovera/admin
```

### First-time login

1. Go to the `/admin` URL above
2. Click **"Login with GitHub"**
3. Authorise the app — this uses Sveltia's hosted OAuth proxy so GitHub Pages can work with it
4. You're in

### What you can do in the CMS

**Site Settings** — the first collection in the sidebar. This is where you:
- Flip the **open/closed toggle** (`Is Open Today?`)
- Update **opening hours**
- Edit the **"This week" hours note** for weekend exceptions
- Update **Instagram / Facebook links**
- Edit the **story text**

**Menu** — edit your focaccia sandwich list. Add new items with the `+` button, drag to reorder, click the bin to delete.

**Photo Gallery** — upload photos and add captions. Images are stored in the repo under `public/images/`.

### After saving in the CMS

Every save triggers a GitHub commit. GitHub Actions then rebuilds the site automatically — it takes about **1–2 minutes** before your changes are live.

---

## Updating weekend hours

Your schedule alternates — some weekends you're open (Fri–Sun 5–10pm), others you're not. The quickest way to manage this:

1. Open the CMS → **Site Settings**
2. Flip **Is Open Today?** on/off as needed
3. Update the **"Hours note"** field — e.g.:
   - `"Open this weekend (Fri–Sun 5–10pm) — see you there."`
   - `"Closed this weekend — back Wednesday 7pm."`
4. Hit **Save** → live in ~2 minutes

---

## Deploying / going live

### GitHub Pages (automatic)

Every push to `main` automatically deploys. The workflow is in `.github/workflows/deploy.yml`.

**One-time setup** (do this once in GitHub):
1. Go to your repo → **Settings** → **Pages**
2. Set Source to **"GitHub Actions"**
3. That's it — the next push will deploy

The site will be live at: `https://nathanasaide.github.io/LaCucinaPovera`

### Pointing your domain (`impoverishedkitchen.co.uk`)

1. In GitHub repo → **Settings** → **Pages** → **Custom domain**, enter `impoverishedkitchen.co.uk`
2. With your domain registrar, add these DNS records:

   | Type | Name | Value |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `nathanasaide.github.io` |

3. Once DNS propagates (up to 24h), GitHub will issue a free SSL certificate automatically
4. Update `astro.config.mjs` — change `site` to `'https://impoverishedkitchen.co.uk'` and remove the `base` line, then also update `public/admin/config.yml` — change `site_url` to `'https://impoverishedkitchen.co.uk'`

---

## Project structure

```
src/
  content/
    settings/
      site.json        ← open/closed, hours, social links, address, story
    menu/
      focaccia.json    ← focaccia sandwich items
    photos/
      gallery.json     ← photo gallery list
  pages/
    index.astro        ← homepage
    menu.astro         ← menu page
    photos.astro       ← photo gallery page
  layouts/
    Layout.astro       ← nav + footer (shared across all pages)
  components/
    Gallery.vue        ← interactive photo gallery with lightbox
  styles/
    global.css         ← all styles, colour palette, typography
public/
  images/              ← put photo files here
  admin/
    index.html         ← CMS entry point
    config.yml         ← CMS configuration
.github/
  workflows/
    deploy.yml         ← auto-deploy to GitHub Pages on push to main
```

---

## Colour palette

| Name | Hex | Used for |
|---|---|---|
| Terracotta | `#C0644A` | Primary accent, headings, buttons |
| Dusty Rose | `#C9847A` | Secondary accent |
| Cream | `#FAF6F0` | Page background |
| Warm Beige | `#E8DCCC` | Section backgrounds, menu area |
| Olive Green | `#6B7A4A` | "Open" status badge, dietary labels |
| Saffron Yellow | `#D4A030` | Footer headings, hours note accent |

---

## Tech stack

- **[Astro](https://astro.build)** — static site generator
- **[Vue 3](https://vuejs.org)** — interactive components (photo gallery lightbox)
- **TypeScript** — type-safe content schemas
- **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)** — Git-based CMS, no server needed
- **GitHub Pages** — free static hosting with automatic HTTPS
- **GitHub Actions** — auto-deploy on every commit
