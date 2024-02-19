package gui

import "lethalmodding.com/concrete/src/app/types"

func (a *App) GetConfig() types.Config {
	return *a.Config
}

func (a *App) GetConfigValue(key string) string {
	return a.Config.Get(key)
}

func (a *App) SetConfigValue(key string, value string) {
	a.Config.Set(key, value)
}
