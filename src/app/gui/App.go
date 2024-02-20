package gui

import (
	"context"

	log "github.com/AlbinoGeek/logxi/v1"

	"lethalmodding.com/concrete/src/app/loopbackServer"
	"lethalmodding.com/concrete/src/app/steam"
	"lethalmodding.com/concrete/src/app/types"
)

type App struct {
	ctx    context.Context
	logger log.Logger

	Config         *types.Config
	LoopbackServer *loopbackServer.Server
	Steam          *steam.Steam
}

func NewApp() *App {
	return &App{
		logger: log.New("Concrete"),

		Config: types.NewConfig(),
		Steam:  steam.NewSteam(),
	}
}

func (a *App) GetSteam() steam.Steam {
	return *a.Steam
}

//!! Lifecycle Documentation !!
// - OnStartup is called BEFORE the window is created.
// - OnDomReady is called AFTER the js.dom is ready.
// - OnBeforeClose is called BEFORE the window is closed.
// - OnShutdown is called AFTER the window is closed.
