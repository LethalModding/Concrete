package gui

import (
	"github.com/wailsapp/wails/v2/pkg/options"
)

func (app *App) OnSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	app.logger.Info("=== OnSecondInstanceLaunch ===")
}
