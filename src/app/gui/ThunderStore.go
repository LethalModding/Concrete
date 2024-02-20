package gui

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

var apiRoot = "http://localhost:9000/api"

func APIPath(path string) string {
	return fmt.Sprintf("%s/%s", apiRoot, path)
}

func APIGet(path string) (string, error) {
	req, err := http.NewRequest("GET", APIPath(path), nil)
	if err != nil {
		return "", err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func (a *App) GetRecommendedMods() []string {
	result, err := APIGet("concrete/mods/recommended")
	if err != nil {
		a.logger.Error("Error getting recommended mods", "error", err)
		return nil
	}

	var mods []string
	err = json.Unmarshal([]byte(result), &mods)
	if err != nil {
		a.logger.Error("Error unmarshalling response", "error", err)
		return nil
	}

	return mods
}

func (a *App) GetTSMod(name string) string {
	result, err := APIGet(fmt.Sprintf("ts/package/%s", name))
	if err != nil {
		a.logger.Error("Error getting TS mod", "error", err)
		return ""
	}

	return result
}
