# Releasing

EZ IMG SAVE uses Semantic Versioning, Release Please, GitHub Releases, and Chrome Web Store API v2.

## Local package

```bash
npm ci
npm run check
npm run package
```

The uploadable archive is written to `dist-zip/ez-img-save-<version>.zip`. Its root contains `manifest.json`; do not zip the `dist` directory itself as an extra parent folder.

## Versioning

Use Conventional Commit-style pull request titles. Release Please maintains `CHANGELOG.md`, updates `package.json`, and opens a release pull request. Merging that pull request creates a `v<version>` GitHub release.

Because `manifest.config.ts` reads `package.json`, the extension manifest always receives the same version. Chrome Web Store rejects a package whose manifest version is not greater than the currently published version.

## First Chrome Web Store setup

These steps require the developer account owner and are intentionally not automated:

1. Enable two-step verification on the Google account that owns the publisher.
2. Create a Chrome Web Store item and note its extension ID.
3. Complete the Store listing, Privacy, and Distribution tabs using `docs/STORE_LISTING.md`.
4. Upload the first package and publish once with the intended visibility. The API cannot apply a new visibility setting until that visibility has been published manually at least once.
5. Create or select a Google Cloud project, enable Chrome Web Store API, configure OAuth consent, and obtain an OAuth client plus refresh token for the publisher account.

The repository workflow currently uploads ZIP packages. Do not opt into Verified CRX Uploads unless the workflow is first changed to sign and upload CRX files with a protected private key.

## GitHub environment and secrets

Create a protected GitHub environment named `chrome-web-store`. Requiring manual approval is recommended: a GitHub release can prepare a submission automatically while a maintainer still controls the external publish action.

Add these environment secrets:

| Secret              | Value                                          |
| ------------------- | ---------------------------------------------- |
| `CWS_CLIENT_ID`     | OAuth client ID                                |
| `CWS_CLIENT_SECRET` | OAuth client secret                            |
| `CWS_REFRESH_TOKEN` | Refresh token issued for the publisher account |
| `CWS_PUBLISHER_ID`  | Publisher ID from CWS dashboard settings       |
| `CWS_EXTENSION_ID`  | Store item/extension ID                        |

The workflow builds from the release tag, uploads the ZIP, and calls the CWS publish endpoint. Chrome Web Store review still applies; successful API submission does not mean the update is already public.

## Rollback

Use the Chrome Web Store dashboard rollback control when available. Do not reuse or decrease a version number. Fix forward with a new patch version after the immediate rollback is complete.
