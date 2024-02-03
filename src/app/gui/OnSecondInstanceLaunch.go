package gui

import (
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/options"
)

func (app *App) OnSecondInstanceLaunch(secondInstanceData options.SecondInstanceData) {
	fmt.Println("OnSecondInstanceLaunch")
}
