# ts-lube

[![Known Vulnerabilities](https://snyk.io/test/github/insidewhy/ts-lube/badge.svg)](https://snyk.io/test/github/insidewhy/ts-lube)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

## Usage

```bash
ts-lube dist
```

Runs `npx tsc --incremental --watch` and runs `node dist` after the first compilation finishes and then restarts it whenever changes are detected (debouncing updates by 300ms).

```bash
ts-lube -y -d 500 dist/kittens.js
```

Runs `yarn tsc --incremental --watch` and runs `node dist/kittens.js` after the first compilation finishes and then restarts it whenever changes are detected (debouncing updates by 500ms).
