# How to log into Sveltia CMS

This is where you go to update everything on the site — open/closed status,
hours, menu items, photos, Instagram link — without touching any code.

---

## Before you can log in — one-time GitHub setup

This only needs doing once, before the first login.

### Step 1 — Push the repo to GitHub

If you haven't already:

```bash
cd /Users/nathanasaide/LaCucinaPovera
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/nathanasaide/LaCucinaPovera.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub: `https://github.com/nathanasaide/LaCucinaPovera`
2. Click **Settings** (top right tab)
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. That's it — the site will build and deploy automatically on the next push

---

## Logging in

Once the site is live on GitHub Pages, your CMS is at:

```
https://nathanasaide.github.io/LaCucinaPovera/admin
```

### What you'll see

A login screen with a single button: **"Login with GitHub"**

### What happens when you click it

1. GitHub opens a pop-up asking you to authorise the app
2. The authorisation goes through **Sveltia's hosted OAuth proxy**
   (`sveltia-cms-auth.netlify.app`) — this is a trusted, free service
   that handles the GitHub login handshake so GitHub Pages can work
   with the CMS (GitHub Pages can't do this itself)
3. You click **Authorise** in the pop-up
4. The pop-up closes and you're straight into the CMS

You only need to do the authorise step once — after that it remembers you.

---

## What you'll see inside

The left sidebar has three sections:

| Section | What you can change |
|---|---|
| **Site Settings** | Open/closed toggle, opening hours, this week's note, address, phone, email, Instagram link |
| **Menu** | Focaccia sandwich items — add, edit, remove, reorder |
| **Photo Gallery** | Upload photos, add captions |

---

## Changing the open / closed status

This is the thing you'll do most often.

1. Log into the CMS
2. Click **Site Settings** in the left sidebar
3. Click **General Settings**
4. Find the **"Is Open Today?"** toggle — flip it on or off
5. Optionally update **"Hours note / this week's exception"** with something like:
   - `"Open this weekend (Fri–Sun 5–10pm) — see you there."`
   - `"Closed this weekend — back Wednesday 7pm."`
6. Click **Save** in the top right
7. **Done** — the site rebuilds automatically and is live in about 2 minutes

The open/closed dot in the nav updates, and the note appears under your
hours table on the homepage.

---

## Updating the menu

1. Log in → **Menu** → **Focaccia Sandwiches**
2. To **edit** an item — click on it, change the fields, Save
3. To **add** a new item — scroll to the bottom of the list, click **"Add menu items"**
4. To **remove** an item — click the item, then the bin/delete icon
5. To **reorder** — drag the handle on the left of each item
6. Click **Save**

---

## Uploading photos

1. Log in → **Photo Gallery** → **Gallery**
2. Click **"Add photos"**
3. Click the image field and upload your photo
4. Fill in **Alt Text** (a description — e.g. `"Focaccia with chorizo and peppers"`)
5. Optionally add a **Caption** — shown in the lightbox when someone clicks the photo
6. Click **Save**

Photos are stored directly in the GitHub repo under `public/images/`.
They get served fast through GitHub's CDN.

**Tips for fast-loading images:**
- Resize photos to max **1400px wide** before uploading (saves load time)
- Use JPEG for food photos — smaller file size than PNG
- A free tool to resize/compress: [squoosh.app](https://squoosh.app)

---

## What happens after every save

Every save you make in the CMS creates a commit to your GitHub repo.
GitHub Actions then rebuilds the site. It takes **1–2 minutes** to go live.

You can watch it happen at:
`https://github.com/nathanasaide/LaCucinaPovera/actions`

---

## If the pop-up gets blocked

Some browsers block pop-ups by default. If the GitHub login window doesn't appear:

1. Look for a pop-up blocked icon in your browser's address bar
2. Click it and choose **"Always allow pop-ups from this site"**
3. Try logging in again

---

## If you get logged out

Just go back to `/admin` and click **"Login with GitHub"** again.
It's instant — GitHub remembers you.
