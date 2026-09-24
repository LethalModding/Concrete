package gui

import "github.com/wailsapp/wails/v2/pkg/runtime"

func (app *App) BrowseDirectory(title string) string {
	config := app.Config.Snapshot()
	str, err := runtime.OpenDirectoryDialog(app.ctx, runtime.OpenDialogOptions{
		CanCreateDirectories: false,
		DefaultDirectory:     config.SteamPath,
		Title:                title,
	})
	if err != nil {
		_ = app.logger.Error("Failed to open directory dialog", "error", err)
		return ""
	}

	return str
}
