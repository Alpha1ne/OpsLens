# OpsLens

Learn DevOps by watching it work. OpsLens turns tools and concepts into animated diagrams you can poke at.

## What's inside

| Section | What you learn |
|---|---|
| Git | Working directory, staging, commits, branches, merge, revert, reset |
| Docker | Dockerfile layers, build cache, containers, volumes, registries |
| Kubernetes | Pods, nodes, self-healing, rolling updates |
| AWS EC2 | Instances, VPC, security groups, EBS, pricing models |
| AWS S3 | Buckets, objects, public access, presigned URLs, versioning |
| Scaling | Load balancing, failures, autoscaling |
| CI/CD | Pipeline stages, failed tests, canary releases |
| Incident Room | An on-call game: pick the right first fix before the timer ends |

## Features

- Animated SVG diagrams with live metric tiles
- Step-by-step lessons with hands-on playgrounds
- Light and dark themes, works on phones
- Progress and best score saved in your browser only; no accounts, no tracking
- Strict Content-Security-Policy and security headers in `vercel.json`, plus a script to verify them

## Project files

| File | What it does |
|---|---|
| `index.html` | The page shell. Loads the fonts, `style.css` and `app.js`. |
| `style.css` | All styles, with light and dark themes. |
| `app.js` | All lessons, diagrams and the game. No inline scripts, so the strict security policy works. |
| `favicon.svg` | The OpsLens logo (rack and lens). |
| `robots.txt` | Lets search engines index the site. |
| `vercel.json` | Security headers and cache rules that Vercel applies to every response. |
| `scripts/check-headers.sh` | Checks a live URL and prints PASS or FAIL for each security header. |

## Run locally

No build step and no dependencies. Serve the folder with any static server:

| Command | What it does |
|---|---|
| `python3 -m http.server 8000` | Starts a simple web server in this folder. |
| `http://localhost:8000` | Open this in your browser. |

## Deploy to Vercel

| Command | What it does |
|---|---|
| `npm i -g vercel` | Installs the Vercel command line tool. |
| `vercel login` | Signs you in through the browser. Nothing to type into the terminal. |
| `vercel` | Creates a preview deployment. Keep the defaults (no framework, no build command). |
| `vercel --prod` | Deploys to production. |

Or import this repository in the Vercel dashboard: Add New > Project > Import. Framework preset: Other. Leave Build Command and Output Directory empty.

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

The script exits with 0 when everything passes and 1 when something fails, so it also works in a CI pipeline.

## Notes

- If you add analytics or another external script, add its domain to `script-src` and `connect-src` in `vercel.json`, redeploy and re-run the check.
- Prices in the AWS lessons are approximate. Check AWS for current rates.
- The logos and icons are original drawings. No official brand logos are used.
