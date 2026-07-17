# Contributing

Thanks for helping improve EZ IMG SAVE. Keep changes focused on the extension's single purpose: making webpage images easier to save in a chosen format.

## Local workflow

1. Use Node.js 24 or newer.
2. Run `npm ci`.
3. Make the smallest change that solves the problem.
4. Run `npm run check`.
5. For UI changes, load `dist` in Chrome and verify the popup plus large and small images.

Pull requests should describe the user-visible behavior, include screenshots for visual changes, and call out any new permission or data-handling requirement. Do not add analytics, remote code, or a permission without explaining why the existing implementation cannot work without it.

Use Conventional Commit-style titles such as `fix: keep the button inside the viewport` or `feat: add WebP output`. Release Please derives the changelog and version from merged changes.
