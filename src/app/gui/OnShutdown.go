package gui

import (
	"context"
	"fmt"
)

func (app *App) OnShutdown(ctx context.Context) {
	fmt.Println("OnShutdown")
}
