# OpsLens

Animated, interactive lessons on Git, Docker, Kubernetes, AWS EC2 and S3, scaling and CI/CD, plus the Incident Room on-call game, a Build Lab, a Git Practice terminal, 24 AWS service guides, quick-check quizzes, downloadable notes, a landing page with resume, and light and dark themes.
It is a plain static site: no build step, no dependencies, no secrets.

## Files

| File | What it does |
|---|---|
| `index.html` | The page shell. Loads the fonts, `style.css` and `app.js`. |
| `404.html`, `notfound.css` | Styled not-found page. |
| `og.png`, `apple-touch-icon.png` | Share preview and home-screen icon. |
| `style.css` | All styles, with light and dark themes. |
| `app.js` | All lessons, diagrams and the game. No inline scripts, so the strict security policy works. |
| `favicon.svg` | The OpsLens logo (rack and lens). |
| `robots.txt` | Lets search engines index the site. |
| `vercel.json` | Security headers and cache rules that Vercel applies to every response. |
| `scripts/check-headers.sh` | Checks a live URL and prints PASS or FAIL for each security header. |

## Deploy to Vercel (pick one)

**Option A: Vercel CLI (from this folder, on your computer)**

| Command | What it does |
|---|---|
| `npm i -g vercel` | Installs the Vercel command line tool. |
| `vercel login` | Signs you in through the browser. Nothing to type into the terminal. |
| `vercel` | Creates a preview deployment. Answer the questions; keep the defaults (no framework, no build command). |
| `vercel --prod` | Deploys to production. |

**Option B: Git import.** Push this folder to a repository you choose, then in the Vercel dashboard use Add New > Project > Import. Framework preset: Other. Leave Build Command and Output Directory empty.

**Option C: Dashboard upload.** Not available for plain folders on every plan, so use A or B.

## Verify the security headers after deploying

```bash
./scripts/check-headers.sh https://your-site.vercel.app
```

| Check | Why it matters |
|---|---|
| `Content-Security-Policy` | Blocks injected scripts. Only your own `app.js` may run. No inline scripts and no `eval`. |
| `Strict-Transport-Security` | Tells browsers to use HTTPS only for two years. |
| `X-Content-Type-Options: nosniff` | Stops the browser guessing file types. |
| `X-Frame-Options: DENY` and `frame-ancestors 'none'` | Stops other sites embedding yours (clickjacking). |
| `Referrer-Policy` | Sends only the site name to other sites, not full paths. |
| `Permissions-Policy` | Turns off camera, microphone, location and similar features. |
| `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` | Isolate the site from other origins. |
| `http://` redirect | Plain HTTP must redirect to HTTPS. |

Exit code is 0 when everything passes and 1 when something fails, so you can also run it in a CI pipeline.

## What the Content-Security-Policy allows

| Directive | Value | Reason |
|---|---|---|
| `default-src` | `'none'` | Block everything not listed below. |
| `script-src` | `'self'` | Only `/app.js` from your own site. |
| `style-src` | `'self' https://fonts.googleapis.com` | Your `style.css` and Google Fonts CSS. |
| `style-src-attr` | `'unsafe-inline'` | The diagrams set small `style="..."` values for animation delays. Scripts stay locked. |
| `font-src` | `https://fonts.gstatic.com` | The font files. |
| `img-src` | `'self' data:` | Favicon and inline images. |
| `connect-src` | `'self'` | No calls to other servers. |
| `frame-ancestors`, `object-src`, `base-uri`, `form-action` | `'none'` | Closes common attack paths. |

## Notes

- If you add analytics or another external script later, add its domain to `script-src` and `connect-src` in `vercel.json`, then redeploy and re-run the check.
- The `Strict-Transport-Security` header is set without `preload` on purpose. Preloading is hard to undo, so add it only when you are sure every subdomain will always use HTTPS.
- Progress and best score are saved in the visitor's own browser (localStorage). Nothing is sent anywhere.
- Prices in the AWS lessons are approximate. Check the AWS pricing page for current rates.
