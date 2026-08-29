# HUMANS — run and use Concrete

## Prerequisites

- [Go](https://go.dev/dl/) (`go.mod`), [Bun](https://bun.sh), [Wails v2 CLI](https://wails.io/docs/gettingstarted/installation)
- Steam with Lethal Company

## Install

```bash
git clone https://github.com/LethalModding/Concrete.git Concrete
cd Concrete
go get -u ./...
cd frontend && bun install && cd ..
```

## Development

```bash
LOGXI=* wails dev
```

Build frontend first if needed: `cd frontend && bun run build && cd ..`. Dev UI: `http://localhost:9123`.

Frontend (`cd frontend`): `bun run dev` (9123), `bun run build`, `bun run lint`, `bun run typecheck`.

## Environment

| Variable | Effect |
| --- | --- |
| `LOGXI=*` | Debug logging from [logxi](https://github.com/AlbinoGeek/logxi) during `wails dev` |

## Usage

1. Set Steam library path in Settings if auto-detection fails.
2. Create or select a mod profile; enable ThunderStore mods on the Dashboard.
3. Launch Lethal Company — Concrete stages mods to the profile BepInEx plugins directory.

## Verify

```bash
go test ./...
cd frontend && bun run lint && bun run typecheck && cd ..
```

## Production build

```bash
cd frontend && bun run build && cd ..
wails build
```

Packaging assets: `build/`.

## Uninstall

Delete the clone. Config/profiles persist in the OS app-data path for Concrete.
