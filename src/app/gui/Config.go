package gui

import "lethalmodding.com/concrete/src/app/types"

func (app *App) GetConfig() types.Config {
	return *app.Config
}

func (app *App) GetConfigValue(key string) string {
	return app.Config.Get(key)
}

func (app *App) SetConfigValue(key string, value string) {
	app.Config.Set(key, value)
}
