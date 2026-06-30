# Twinstar: Mirror Comets — landing page + privacy + app-ads.txt

Static site for **Twinstar: Mirror Comets** (Android, `com.twinstar.app`), hosted free on **GitHub Pages**.
It serves three things: the landing page (`index.html`), the privacy policy (`privacy.html`, required by
Google Play + AdMob), and the AdMob verification file (`app-ads.txt`).

Repo: https://github.com/Rafmoshe2500/twinstar-privacy

```
.
├── index.html      # landing page (self-contained: inline CSS + JS)
├── privacy.html    # privacy policy (linked from the site + used as the Play/AdMob privacy URL)
├── privacy.md      # markdown mirror of the privacy policy
├── app-ads.txt     # AdMob verification line
├── robots.txt
├── .nojekyll       # serve files as-is
└── assets/         # icon, feature graphic, screenshots, 20 skin SVGs
```

## ⚠️ Important: app-ads.txt must sit at the DOMAIN ROOT

AdMob's crawler only reads `app-ads.txt` from the **root** of the website domain, e.g.
`https://rafmoshe2500.github.io/app-ads.txt`.

This repo is currently a **project site** named `twinstar-privacy`, so GitHub Pages serves it under a
subpath: `https://rafmoshe2500.github.io/twinstar-privacy/…`. The ad file therefore lands at
`https://rafmoshe2500.github.io/twinstar-privacy/app-ads.txt` — which AdMob will **NOT** find.

### Fix (pick one)

- **A — Rename this repo to a user site (recommended).** GitHub → **Settings → Repository name** →
  rename `twinstar-privacy` to **`Rafmoshe2500.github.io`**. Everything then serves from the root:
  - landing page → `https://rafmoshe2500.github.io/`
  - privacy → `https://rafmoshe2500.github.io/privacy.html`
  - ad file → `https://rafmoshe2500.github.io/app-ads.txt` ✅

  Update the local remote afterward:
  `git remote set-url origin https://github.com/Rafmoshe2500/Rafmoshe2500.github.io.git`
  (You can have only one `*.github.io` user-site repo.)
- **B — Custom domain.** Point a domain you own at this Pages site (CNAME) and host `app-ads.txt` at its root.

> The **privacy policy** works fine from the current project-site URL — only `app-ads.txt` needs the root.

## Deploy / update

```bash
cd C:/twinstar-privacy
git add .
git commit -m "Update site"
git push
```
One-time on GitHub: **Settings → Pages → Source = Deploy from a branch → `main` / root**.
Pages redeploys on every push.

## Connect to AdMob (after the root fix)

1. **Play Console** → app → **Store listing → Website** = your root URL (e.g. `https://rafmoshe2500.github.io`).
2. **AdMob → Apps → app-ads.txt** → confirm the line matches:
   `google.com, pub-5427759306804971, DIRECT, f08c47fec0942fa0`
3. **Check for updates.** Verification can take up to ~24h after the file + Play website match.

## Notes

- Google Play button points to `https://play.google.com/store/apps/details?id=com.twinstar.app` (live once published).
- Contact email: `twinstarmirrorcommets@gmail.com`.
- Never move or rename `app-ads.txt` away from the domain root.
