package gui

import (
	"context"

	log "github.com/AlbinoGeek/logxi/v1"
)

type App struct {
	ctx context.Context
	logger log.Logger
}

func NewApp() *App {
	return &App{
		logger: log.New("Concrete"),
	}
}

//!! Lifecycle Documentation !!
// - OnStartup is called BEFORE the window is created.
// - OnDomReady is called AFTER the js.dom is ready.
// - OnBeforeClose is called BEFORE the window is closed.
// - OnShutdown is called AFTER the window is closed.
