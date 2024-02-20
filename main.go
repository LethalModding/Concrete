package main

import (
	"embed"
	"fmt"

	log "github.com/AlbinoGeek/logxi/v1"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

	"lethalmodding.com/concrete/src/app/gui"
	"lethalmodding.com/concrete/src/app/launcher"
	"lethalmodding.com/concrete/src/app/steam"
)

//go:embed all:frontend/dist/*
var assets embed.FS

func main() {
	app := gui.NewApp()

	err := wails.Run(&options.App{
		AssetServer: &assetserver.Options{Assets: assets},
		Bind: []interface{}{
			app,
			launcher.NewLauncher(),
			steam.NewSteam(),
		},
		Logger:             app.StdLogger(),
		LogLevel:           log.LevelDebug,
		LogLevelProduction: log.LevelWarn,
		OnStartup:          app.OnStartup,
		OnDomReady:         app.OnDomReady,
		OnBeforeClose:      app.OnBeforeClose,
		OnShutdown:         app.OnShutdown,
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "21bef4ab-312a-4316-974c-3ff50e9a8172",
			OnSecondInstanceLaunch: app.OnSecondInstanceLaunch,
		},

		Title: "Concrete - LethalModding.com",

		BackgroundColour: &options.RGBA{R: 25, G: 25, B: 30, A: 200},
		Frameless:        false,
		Height:           720,
		Width:            1280,

		MinHeight: 1080 / 2.5,
		MinWidth:  1920 / 2.5,

		Linux: &linux.Options{
			ProgramName:         "Concrete - LethalModding.com",
			WebviewGpuPolicy:    linux.WebviewGpuPolicyOnDemand,
			WindowIsTranslucent: true,
		},

		Mac: &mac.Options{
			Appearance:           mac.NSAppearanceNameDarkAqua,
			TitleBar:             mac.TitleBarHiddenInset(),
			WindowIsTranslucent:  true,
			WebviewIsTransparent: true,
		},

		Windows: &windows.Options{
			BackdropType:         windows.Acrylic,
			Theme:                windows.Dark,
			WindowIsTranslucent:  true,
			WebviewIsTransparent: true,
		},
	})

	if err != nil {
		fmt.Println(err)
	}
}
