# Legalide

Responsive, single-page HTML/CSS/JavaScript website. All content is kept in `src/` and the deployable build is generated in `dist/`.

Requires Node.js 20+; no npm dependencies or installation step.

```bash
npm run build     # Regenerate dist/ from src/
npm run dev       # Build and serve at http://localhost:3000
npm test          # Static integrity and accessibility checks
```

For deployment, upload the contents of `dist/` to a static web host. The project has no framework dependency, third-party build tools or runtime APIs.

## Notes on intentionally unchanged source content

- Several addresses and legal-services descriptions appear to be template/demo content; verify them before going live. No names, claims or contact information were invented.
- The newsletter has no configured server endpoint. Submitting a valid address shows a clear unavailable message instead of pretending to subscribe someone. Integrate a real newsletter service separately if the website needs subscriptions.
- The original Who We Are photo includes a decorative play symbol, but no video file or provider is supplied. It is displayed as an image, not as an inoperative video button.
- Certain footer labels have no actual destination in the provided site. They remain visible as text rather than clickable links that point nowhere.
- A canonical URL and absolute Open Graph image were not added because the production domain is unknown.
- Browser-based layout checks were run in Chromium. Safari, Firefox, real mobile devices and measured Lighthouse/Core Web Vitals require additional testing in their corresponding environments.
