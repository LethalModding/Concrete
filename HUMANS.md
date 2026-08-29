# HUMANS — run and use Concrete

Authoritative install, environment, and operator workflow for the Concrete desktop app.

## Quick start

```bash
LOGXI=* wails dev
```

If the frontend is not built yet, run `cd frontend && bun run build && cd ..` first.

## Prerequisites

- [Go](https://go.dev/dl/) (see `go.mod` for the module version)
- [Bun](https://bun.sh) for the Next.js frontend
- [Wails v2 CLI](https://wails.io/docs/gettingstarted/installation): `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- Steam with Lethal Company installed

## First-time setup

Clone and install dependencies:

```bash
git clone https://github.com/LethalModding/Concrete.git Concrete
cd Concrete
go get -u ./...
cd frontend && bun install && cd ..
```

## Development

Run the app in dev mode (hot-reload frontend via `wails.json` dev server URL):

```bash
LOGXI=* wails dev
```

Wails serves the UI from `http://localhost:9123` during development and embeds `frontend/dist` in production builds.

### Frontend only

```bash
cd frontend
bun run dev    # Next.js on port 9123
bun run build  # static export into frontend/dist
bun run lint   # Biome
bun run typecheck
```

### Backend tests

```bash
go test ./...
```

## Environment

| Variable | Effect |
| --- | --- |
| `LOGXI=*` | Enables structured debug logging from [logxi](https://github.com/AlbinoGeek/logxi) during `wails dev` |

## Operator workflow

1. Point Concrete at your Steam library path (Settings) if auto-detection misses it.
2. Create or select a mod profile on the Profiles page.
3. Enable recommended or custom ThunderStore mods on the Dashboard.
4. Launch Lethal Company; Concrete stages enabled mods under the profile BepInEx plugins directory before start.

Config keys (`steamPath`, `libraryPath`, `loopbackServerPort`, `dismissLogin`) persist through the Wails-bound `types.Config` API exposed to the UI.

## Production build

```bash
cd frontend && bun run build && cd ..
wails build
```

Platform-specific packaging assets live under `build/`.
