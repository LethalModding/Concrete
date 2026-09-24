// Package launcher installs the game loader and starts the game with a profile.
package launcher

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"lethalmodding.com/concrete/src/app/types"
)

type Launcher struct{}

func NewLauncher() *Launcher {
	return &Launcher{}
}

func secureArchivePath(basePath, archiveName string) (string, error) {
	basePath, err := filepath.Abs(basePath)
	if err != nil {
		return "", fmt.Errorf("failed to resolve destination path: %w", err)
	}

	archivePath := filepath.FromSlash(archiveName)
	if filepath.IsAbs(archivePath) {
		return "", fmt.Errorf("invalid archive path: %s", archiveName)
	}

	targetPath := filepath.Clean(filepath.Join(basePath, archivePath))
	destinationPrefix := basePath
	if !strings.HasSuffix(destinationPrefix, string(os.PathSeparator)) {
		destinationPrefix += string(os.PathSeparator)
	}
	if !strings.HasPrefix(targetPath, destinationPrefix) {
		return "", fmt.Errorf("invalid archive path: %s", archiveName)
	}

	return targetPath, nil
}

const bepinexRelease = "https://github.com/BepInEx/BepInEx/releases/download/v5.4.22/BepInEx_x64_5.4.22.0.zip"

func (l *Launcher) InstallBepInEx(gamePath, profilePath string) error {
	// Ensure gamePath and profilePath exist
	if _, err := os.Stat(gamePath); os.IsNotExist(err) {
		return fmt.Errorf("game path does not exist: %s", gamePath)
	}

	if _, err := os.Stat(profilePath); os.IsNotExist(err) {
		return fmt.Errorf("profile path does not exist: %s", profilePath)
	}

	// Download the latest BepInEx release
	resp, err := http.Get(bepinexRelease)
	if err != nil {
		return err
	}
	defer func() { _ = resp.Body.Close() }()

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
		defer func() { _ = fileReader.Close() }()

		// TODO: Chunking for large files
		data := make([]byte, file.UncompressedSize64)
		if _, err = fileReader.Read(data); err != nil && !errors.Is(err, io.EOF) {
			return err
		}

		var destinationPath string

		// Write /doorstop_config.ini and /winhttp.dll to the game directory
		if file.Name == "doorstop_config.ini" || file.Name == "winhttp.dll" {
			destinationPath = gamePath
		} else {
			destinationPath = profilePath
		}

		targetPath, err := secureArchivePath(destinationPath, file.Name)
		if err != nil {
			return err
		}

		// Ensure the directory exists
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o750); err != nil {
			return err
		}

		// Create the output file
		fileWriter, err := os.Create(targetPath) //nolint:gosec // secureArchivePath confines archive entries beneath the destination.
		if err != nil {
			return err
		}

		// Write the output file
		if _, err = fileWriter.Write(data); err != nil {
			return err
		}

		// Close the output file, flushing it to disk
		if err := fileWriter.Close(); err != nil {
			return err
		}
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

	// Execute the game
	exeName := ""
	switch runtime.GOOS {
	case "windows":
		exeName = "steam.exe"
	case "darwin":
		exeName = "Steam.app"
	case "linux":
		exeName = "steam"
	}

	args := []string{
		"-applaunch",
		"1966720",
		"--doorstop-enabled",
		"true",
		"--doorstop-target-assembly",
		profile.ID + "/BepInEx/core/BepInEx.Preloader.dll",
	}

	cmd := exec.CommandContext(context.Background(), filepath.Join(steamPath, exeName), args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to launch game: %w", err)
	}

	return nil
}
