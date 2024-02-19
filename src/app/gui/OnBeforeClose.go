package gui

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (app *App) OnBeforeClose(ctx context.Context) (prevent bool) {
    app.logger.Info("=== OnBeforeClose ===")

	result, err := runtime.MessageDialog(ctx, runtime.MessageDialogOptions{
        Type:          runtime.QuestionDialog,
        Title:         "Quit?",
        Message:       "Are you sure you want to quit?",
    })

    if err != nil {
        return false
    }

	return result != "Yes"
}
