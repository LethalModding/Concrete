package gui

import (
	"context"

	loopbackserver "lethalmodding.com/concrete/src/app/loopbackServer"
)

// OnStartup initializes the application and its local services.
func (app *App) OnStartup(ctx context.Context) {
	app.logger.Info("=== OnStartup ===")
	app.ctx = ctx

	//
	// Initialize reference to the Steam installation
	//
	if err := app.Steam.Find(); err != nil {
		_ = app.logger.Error("Failed to find Steam installation", "error", err)
	} else {
		app.logger.Info("Found Steam installation",
			"configured path", app.Config.SteamPath,
			"detected path", app.Steam.InstallPath,
			"library folders", app.Steam.LibraryFolders,
		)
	}

	//
	// Initialize local web server to handle OAuth2 redirects
	//
	app.LoopbackServer = loopbackserver.NewServer(app.Config.LoopbackServerPort)
	app.logger.Info("Starting local web server to handle OAuth2 redirects",
		"url", app.LoopbackServer.URL())
	go func() {
		if err := app.LoopbackServer.Start(); err != nil {
			_ = app.logger.Error("Failed to start local web server", "error", err)
		}
	}()
}
