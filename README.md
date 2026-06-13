# Twinstar — landing site + app-ads.txt

A static landing page for the **Twinstar** Android game, hosted free on **GitHub Pages**.
Its main job (besides looking good) is to host **`app-ads.txt`** at the domain root so **Google AdMob** can verify your app.

```
.
├── index.html        # the landing page (self-contained: inline CSS + JS)
├── privacy.html      # privacy policy (required by AdMob + Google Play)
├── app-ads.txt       # ★ AdMob verification file — MUST stay at the repo root
├── robots.txt
├── .nojekyll         # serve files as-is (no Jekyll processing)
└── assets/           # icon, feature graphic, screenshots, 20 skin SVGs
```

## ⚠️ Why this MUST be a "user site" repo (`<username>.github.io`)

`app-ads.txt` only works when it sits at the **root of the domain**:
`https://<username>.github.io/app-ads.txt`

GitHub Pages **project** sites live under a subpath (`/<reponame>/`), so the file would land at
`https://<username>.github.io/<reponame>/app-ads.txt` — which AdMob's crawler will **not** find.
Therefore the repo must be named exactly **`<username>.github.io`**.

## Publish (one time)

1. Create a new **public** repo on GitHub named exactly `YOUR-USERNAME.github.io`.
2. Push these files to it:
   ```bash
   cd C:/twinstar-site
   git init
   git add .
   git commit -m "Twinstar landing page + app-ads.txt"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source = "Deploy from a branch", Branch = `main` / root**. Save.
4. Wait ~1–2 minutes, then open `https://YOUR-USERNAME.github.io` — the site should be live.
5. Confirm the ad file is reachable (plain text, the publisher line):
   `https://YOUR-USERNAME.github.io/app-ads.txt`

## Connect it to AdMob

1. **Google Play Console** → your app → **Store presence → Main store listing → Website** =
   `https://YOUR-USERNAME.github.io` → save & publish the listing.
2. **AdMob** → **Apps → app-ads.txt** → confirm the line shown matches `app-ads.txt`
   (it should be `google.com, pub-5427759306804971, DIRECT, f08c47fec0942fa0`).
3. Click **Check for updates**. AdMob re-crawls on its own schedule too — verification can take
   up to ~24h after the file and the Play listing website match.

## Things to personalize (search & replace)

- `USERNAME` → your GitHub username (in `index.html` Open Graph tags + `robots.txt`).
- Google Play button currently points to `https://play.google.com/store/apps/details?id=com.twinstar.app`
  — correct once the app is published; harmless 404 until then.
- Contact email is `rafmoshe2500@gmail.com` (in `index.html` footer + `privacy.html`).

## Updating later

Edit the files and `git push` again — GitHub Pages redeploys automatically.
Never move or rename `app-ads.txt`; it must remain at the root.
