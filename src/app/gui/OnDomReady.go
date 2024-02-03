package gui

import (
	"context"
	"fmt"
)

func (app *App) OnDomReady(ctx context.Context) {
	fmt.Println("OnDomReady")
}
