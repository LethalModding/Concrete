package gui

import (
	"context"
	"fmt"
)

// onStartup is a Wails function that is called when the application is started.
// It is used to initialize the application.
func (app *App) OnStartup(ctx context.Context) {
	app.ctx = ctx

	fmt.Println("OnStartup")
}
