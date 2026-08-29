<h1 align="center">Concrete</h1>

<div align="center">

[![CodeQL Analysis Workflow Status](https://github.com/LethalModding/Concrete/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/LethalModding/Concrete/actions)
[![License](https://badgen.net/badge/License/CC-BY-NC-SA-2.0/blue)](https://github.com/LethalModding/Concrete/blob/main/LICENSE.txt)

</div>

---

Concrete is a desktop mod manager for [Lethal Company](https://store.steampowered.com/app/1966720/Lethal_Company/) from [LethalModding.com](https://lethalmodding.com). It discovers your Steam library, curates ThunderStore mods, and launches the game with profile-specific BepInEx plugin sets.

Built with [Wails](https://wails.io) (Go backend, embedded Next.js UI).

## Quick start

```bash
LOGXI=* wails dev
```

See [HUMANS.md](HUMANS.md) for prerequisites, first-time setup, and dev workflow.

## Highlights

- Steam library and Lethal Company install detection (Linux and Windows)
- Mod profiles with enabled/disabled plugin lists and launch instructions
- ThunderStore recommended-mod integration via a local loopback API
- Single-instance desktop app with translucent dark UI (Material UI + Next.js)

## Documentation

| Topic | Location |
| --- | --- |
| Install, prerequisites, dev mode | [HUMANS.md](HUMANS.md) |
| Code layout and invariants | [AGENTS.md](AGENTS.md) |
| License | [LICENSE.txt](LICENSE.txt) |

## License

Copyright (c) LethalModding.com. Licensed under [CC BY-NC-SA 2.0](LICENSE.txt).
