package gui

import "github.com/wailsapp/wails/v2/pkg/runtime"

func (a *App) BrowseDirectory(title string) string {
	str, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		CanCreateDirectories: false,
		DefaultDirectory: a.Config.SteamPath,
		Title: title,
	})
	if err != nil {
		a.logger.Error("Failed to open directory dialog", "error", err)
		return ""
	}

	return str
}
