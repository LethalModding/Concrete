# AGENTS — Concrete internals

LLM and contributor map for the Wails desktop app. Setup steps live in [HUMANS.md](HUMANS.md).

## Entrypoints

| Path | Role |
| --- | --- |
| `main.go` | Wails app bootstrap, embeds `frontend/dist`, binds Go services |
| `wails.json` | Wails project config (frontend install/build/dev commands) |
| `frontend/src/pages/` | Next.js pages (`index`, `dashboard`, `profiles`) |
| `src/app/gui/` | Wails lifecycle, config, ThunderStore HTTP client |
| `src/app/launcher/` | Game launch and BepInEx plugin staging |
| `src/app/steam/` | Steam path and library-folder discovery |
| `src/app/loopbackServer/` | Local HTTP server for UI ↔ backend helpers |
| `src/app/types/` | `Config` and `Profile` JSON models |

## Architecture

```
main.go
  └─ gui.App (Wails bind)
       ├─ types.Config        persisted settings
       ├─ steam.Steam         library detection
       ├─ loopbackServer      localhost API
       └─ launcher.Launcher   profile → game start
frontend (Next.js + MUI)
  └─ wailsjs/go/*              generated Wails bindings
```

ThunderStore calls in `src/app/gui/ThunderStore.go` hit `http://localhost:9000/api` (loopback server), not ThunderStore directly from the UI.

## Lifecycle (gui package)

| Hook | When |
| --- | --- |
| `OnStartup` | Before the window is created; starts loopback server |
| `OnDomReady` | After the webview DOM is ready |
| `OnBeforeClose` | Before window close |
| `OnShutdown` | After window close |
| `OnSecondInstanceLaunch` | Second app instance hands off to the first |

## State model

- **`types.Config`**: `steamPath`, `libraryPath`, `loopbackServerPort` (default `45816`), `dismissLogin`. String get/set API for Wails binding.
- **`types.Profile`**: mod profile with `enabledMods` / `disabledMods`, metadata, ordering, and launch `instructions`. New profiles get a UUID v4 `id`.

## Invariants

- Production assets come from `//go:embed all:frontend/dist/*`; run `bun run build` in `frontend/` before `wails build`.
- `SingleInstanceLock` UUID in `main.go` must stay stable across releases for OS-level single-instance behavior.
- Launcher ensures enabled mods exist under the profile `BepInEx/plugins/` tree before starting the game.
- Do not add install or operator walkthroughs here — [HUMANS.md](HUMANS.md) owns run/use docs.

## Generated code

`frontend/wailsjs/` is Wails-generated; regenerate with `wails generate module` after changing bound Go methods.
