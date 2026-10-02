# My Obsidian Page Width

Obsidian plugin that toggles every page between the default **readable line width** and a
**full-width** layout. The toggle lives in each view header, in the ribbon and in the command
palette (_Toggle full page width_). The choice is remembered across restarts and applies to
pop-out windows too.

- Fully local: no network requests, telemetry or external services.
- Works with the default theme and with Minimal (overrides its `--line-width` / `--max-width`
  and the `.wide` / `.max` helpers).
- Desktop, iPadOS and iOS.

## Installation

Development requirements: Node.js ≥ 21.2 and pnpm (version pinned in `package.json`;
`corepack enable` sets it up).

1. Point `.env` at your vault (not versioned; start from `.env.example`):

   ```bash
   cp .env.example .env
   # OBSIDIAN_VAULT_PATH=/absolute/path/to/vault   (the folder that contains .obsidian/)
   ```

2. Install dependencies, build and copy into the vault:

   ```bash
   pnpm install
   pnpm run install:vault
   ```

   The script builds and copies `main.js`, `manifest.json` and `styles.css` into
   `<VAULT>/.obsidian/plugins/my-obsidian-page-width/`. If the path has no `.obsidian/` it stops
   with an error without creating anything.

3. In Obsidian: _Settings → Community plugins_ → reload the list → enable
   **My Obsidian Page Width**.

**Manual install** (no `.env`): after `pnpm build`, copy the three files into
`<VAULT>/.obsidian/plugins/my-obsidian-page-width/`.

## Development

```bash
pnpm dev          # watch mode; copies every rebuild into the vault if .env is set
pnpm build        # type check + production bundle
pnpm test         # unit tests (vitest)
pnpm lint         # eslint
pnpm format       # prettier
```

| Path                  | Contents                                      |
| --------------------- | --------------------------------------------- |
| `main.ts`             | Plugin entry: ribbon, command, header buttons |
| `src/width-toggle.ts` | State parsing and the body class toggle       |
| `styles.css`          | CSS variables overridden in full-width mode   |
| `scripts/`            | Vault install helpers (`OBSIDIAN_VAULT_PATH`) |
| `tests/`              | Unit tests                                    |

## License

MIT — see `LICENSE`.
