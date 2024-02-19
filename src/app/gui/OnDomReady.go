package gui

import (
	"context"
)

func (app *App) OnDomReady(ctx context.Context) {
	app.logger.Info("=== OnDomReady ===")
}
