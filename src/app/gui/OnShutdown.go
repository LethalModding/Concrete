package gui

import (
	"context"
)

func (app *App) OnShutdown(ctx context.Context) {
	app.logger.Info("=== OnShutdown ===")

	//
	// Stop the local web server
	//
	if err := app.LoopbackServer.Stop(); err != nil {
		_ = app.logger.Error("Failed to stop local web server", "error", err)
	}
}
