package gui

import (
	"io"
	"net/http"
)

func (a *App) GetTSMod(name string) string {
	req, err := http.NewRequest("GET", "http://localhost:9000/api/ts/package/"+name, nil)
	if err != nil {
		a.logger.Error("Error creating request", "error", err)
		return ""
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		a.logger.Error("Error sending request", "error", err)
		return ""
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		a.logger.Error("Error reading response", "error", err)
		return ""
	}

	result := string(body)
	return result
}
