// Package gui manages the Concrete desktop application's lifecycle and integrations.
package gui

import (
	"context"

	log "github.com/AlbinoGeek/logxi/v1"

	loopbackserver "lethalmodding.com/concrete/src/app/loopbackServer"
	"lethalmodding.com/concrete/src/app/steam"
	"lethalmodding.com/concrete/src/app/types"
)

type App struct {
	ctx    context.Context //nolint:containedctx // Wails bound methods need the lifecycle context for runtime calls.
	logger log.Logger

	Config         *types.Config
	LoopbackServer *loopbackserver.Server
	Steam          *steam.Steam
}

func NewApp() *App {
	return &App{
		logger: log.New("Concrete"),

		Config: types.NewConfig(),
		Steam:  steam.NewSteam(),
	}
}

func (app *App) GetSteam() steam.Steam {
	return *app.Steam
}

//!! Lifecycle Documentation !!
// - OnStartup is called BEFORE the window is created.
// - OnDomReady is called AFTER the js.dom is ready.
// - OnBeforeClose is called BEFORE the window is closed.
// - OnShutdown is called AFTER the window is closed.
