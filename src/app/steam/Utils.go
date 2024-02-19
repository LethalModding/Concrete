package steam

import (
	"os"
	"path/filepath"
)

func (*Steam) ValidateSteamPath(steamPath string) bool {
	stat, err := os.Stat(steamPath)
	if err != nil || !stat.IsDir() {
		return false
	}

	steamappsPath := filepath.Join(steamPath, "steamapps")
	if stat, err = os.Stat(steamappsPath); err != nil || !stat.IsDir() {
		return false
	}

	return true
}

func (s *Steam) ValidateLibraryPath(libraryPath string) bool {
	if !s.ValidateSteamPath(libraryPath) {
		return false
	}

	gamePath := filepath.Join(libraryPath, "steamapps", "common", "Lethal Company")
	if stat, err := os.Stat(gamePath); err != nil || !stat.IsDir() {
		return false
	}

	return true
}
