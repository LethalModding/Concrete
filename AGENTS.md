# AGENTS — Concrete internals

Wails desktop app. Setup: [HUMANS.md](HUMANS.md).

## Entrypoints

| Path | Role |
| --- | --- |
| `main.go` | Wails bootstrap, embeds `frontend/dist`, binds Go services |
| `wails.json` | Wails config (frontend install/build/dev) |
| `frontend/src/pages/` | Next.js pages (`index`, `dashboard`, `profiles`) |
| `src/app/gui/` | Lifecycle, config, ThunderStore HTTP client |
| `src/app/launcher/` | Game launch, BepInEx plugin staging |
| `src/app/steam/` | Steam path and library discovery |
| `src/app/loopbackServer/` | Local HTTP for UI ↔ backend |
| `src/app/types/` | `Config` and `Profile` JSON models |

ThunderStore HTTP in `src/app/gui/ThunderStore.go` uses `http://localhost:9000/api` (loopback), not direct from the UI.

## State

- **`types.Config`**: `steamPath`, `libraryPath`, `loopbackServerPort` (default `45816`), `dismissLogin`.
- **`types.Profile`**: `enabledMods` / `disabledMods`, metadata, ordering, launch `instructions`. New profiles get UUID v4 `id`.

## Invariants

- Production assets from `//go:embed all:frontend/dist/*`; run `bun run build` in `frontend/` before `wails build`.
- `SingleInstanceLock` UUID in `main.go` stays stable across releases.
- Launcher stages enabled mods under profile `BepInEx/plugins/` before game start.
- Install/operator docs: [HUMANS.md](HUMANS.md).

## Generated code

`frontend/wailsjs/` is Wails-generated; run `wails generate module` after changing bound Go methods.
