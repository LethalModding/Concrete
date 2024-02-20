package launcher

import (
	"archive/zip"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"lethalmodding.com/concrete/src/app/types"
)

var ()

type Launcher struct {
}

func NewLauncher() *Launcher {
	return &Launcher{}
}

var (
	bepinexRelease = "https://github.com/BepInEx/BepInEx/releases/download/v5.4.22/BepInEx_x64_5.4.22.0.zip"
)

func (l *Launcher) InstallBepInEx(gamePath, profilePath string) error {
	// Ensure gamePath and profilePath exist
	if _, err := os.Stat(gamePath); os.IsNotExist(err) {
		return fmt.Errorf("Game path does not exist: %s", gamePath)
	}

	if _, err := os.Stat(profilePath); os.IsNotExist(err) {
		return fmt.Errorf("Profile path does not exist: %s", profilePath)
	}

	// Download the latest BepInEx release
	resp, err := http.Get(bepinexRelease)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Extract the BepInEx release
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	zipReader, err := zip.NewReader(bytes.NewReader(body), int64(len(body)))
	if err != nil {
		return err
	}

	// Iterate through each file in the zip
	for _, file := range zipReader.File {
		// Skip changelog.txt
		if file.Name == "changelog.txt" {
			continue
		}

		// Open the input file
		fileReader, err := file.Open()
		if err != nil {
			return err
		}
		defer fileReader.Close()

		// TODO: Chunking for large files
		data := make([]byte, file.UncompressedSize64)
		if _, err = fileReader.Read(data); err != nil && err != io.EOF {
			return err
		}

		// Close the input file
		fileReader.Close()

		var targetPath string

		// Write /doorstop_config.ini and /winhttp.dll to the game directory
		if file.Name == "doorstop_config.ini" || file.Name == "winhttp.dll" {
			// Write the file to the game directory
			targetPath = gamePath + "/" + file.Name
		} else {
			// Write the file to the profile directory
			targetPath = profilePath + "/" + file.Name
		}

		// Ensure the directory exists
		os.MkdirAll(filepath.Dir(targetPath), 0755)

		// Create the output file
		fileWriter, err := os.Create(targetPath)
		if err != nil {
			return err
		}

		// Write the output file
		if _, err = fileWriter.Write(data); err != nil {
			return err
		}

		// Close the output files
		fileWriter.Close()
	}

	return nil
}

func (l *Launcher) DoLaunchGame(libraryPath, steamPath, profileJSON string) error {
	if libraryPath == "" {
		return errors.New("library path is empty")
	}

	var profile types.Profile
	if err := json.Unmarshal([]byte(profileJSON), &profile); err != nil {
		return fmt.Errorf("failed to unmarshal profile JSON: %w", err)
	}

	//
	// Download and extract the latest BepInEx release
	//

	if err := l.InstallBepInEx(libraryPath, profile.ID); err != nil {
		return fmt.Errorf("failed to install BepInEx: %w", err)
	}

	//
	// Ensure all mods are present in /BepInEx/plugins/* in the profile directory
	//
	fmt.Printf("Profile: %+v\n", profile)

	//
	// Steam.exe -applaunch 1966720 --doorstop-enabled true --doorstop-target-assembly "C:\Users\Belial\AppData\Roaming\r2modmanPlus-local\LethalCompany\profiles\ProfileName\BepInEx\core\BepInEx.Preloader.dll"
	//

	return nil
}
