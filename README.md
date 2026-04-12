# Hebrew/Gregorian Date Picker Demo

Next.js + shadcn/ui demo for Hebrew and Gregorian date pickers.

## Pages

- `/` Main showcase page with Hebrew/Gregorian date picker use-cases.
- `/instructions` Docs-style guide page for creating a Hebrew date picker.

## Development

```bash
pnpm install
pnpm dev
```

## GitHub Pages Deployment (env/prod)

Automatic deployment is configured with GitHub Actions:

- Workflow file: `.github/workflows/deploy-gh-pages.yml`
- Trigger: push to branch `env/prod`
- Build output: static export from `out/`

Important one-time repository setting:

1. Go to GitHub repository Settings.
2. Open Pages.
3. Set Source to `GitHub Actions`.

After this, every push to `env/prod` deploys the site automatically.

## הוספת רכיבי shadcn

```bash
npx shadcn@latest add button
```

הרכיבים יתווספו לתיקייה `components/ui`.
