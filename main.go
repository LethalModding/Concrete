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
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := gui.NewApp()

	err := wails.Run(&options.App{
		AssetServer:        &assetserver.Options{Assets: assets},
		Bind:               []interface{}{app},
        LogLevel:           log.LevelDebug,
        LogLevelProduction: log.LevelError,
		OnStartup:          app.OnStartup,
		OnDomReady: 	    app.OnDomReady,
		OnBeforeClose:      app.OnBeforeClose,
		OnShutdown: 	    app.OnShutdown,
		SingleInstanceLock: &options.SingleInstanceLock{
          UniqueId:               "21bef4ab-312a-4316-974c-3ff50e9a8172",
          OnSecondInstanceLaunch: app.OnSecondInstanceLaunch,
        },
		Title:              "Concrete - LethalModding.com",

		Width:              1024,
		Height:             768,

		BackgroundColour:   &options.RGBA{R: 27, G: 38, B: 54, A: 200},

		Linux:              &linux.Options{
			WindowIsTranslucent:  true,
			WebviewGpuPolicy:     linux.WebviewGpuPolicyOnDemand,
			ProgramName:          "Concrete - LethalModding.com",
		},

		Mac: 			    &mac.Options{
			Appearance:           mac.NSAppearanceNameDarkAqua,
			TitleBar:             mac.TitleBarHiddenInset(),
			WindowIsTranslucent:  true,
		},

		Windows:            &windows.Options{
            WebviewIsTransparent: false,
            WindowIsTranslucent:  true,
            BackdropType:         windows.Acrylic,
            Theme:                windows.SystemDefault,
            CustomTheme:          &windows.ThemeSettings{
                DarkModeTitleBar:           windows.RGB(20, 20, 20),
				DarkModeTitleBarInactive:   windows.RGB(10, 10, 10),
                DarkModeTitleText:          windows.RGB(200, 200, 200),
				DarkModeTitleTextInactive:  windows.RGB(100, 100, 100),
                DarkModeBorder:             windows.RGB(20, 0, 20),
				DarkModeBorderInactive:     windows.RGB(10, 0, 10),
                LightModeTitleBar:          windows.RGB(200, 200, 200),
				LightModeTitleBarInactive:  windows.RGB(100, 100, 100),
                LightModeTitleText:         windows.RGB(20, 20, 20),
				LightModeTitleTextInactive: windows.RGB(10, 10, 10),
                LightModeBorder:            windows.RGB(200, 200, 200),
				LightModeBorderInactive:    windows.RGB(100, 100, 100),
            },
		},
	})

	if err != nil {
		fmt.Println(err)
	}
}
