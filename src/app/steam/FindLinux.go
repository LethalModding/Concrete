//go:build !windows
// +build !windows

package steam

import (
	"fmt"
	"os"
	"path/filepath"
)

// Find attempts to locate the Steam installation on your system.
//
// It uses the OS-specific find function to locate the Steam installation, and
// then uses the Steam installation to find the library folders. If the Steam
// installation cannot be found, an error is returned.
func (s *Steam) Find() error {
	home, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("%w: %s: %v", ErrSteamNotFound,
			"could not find Steam installation", err)
	}

	possibleLocations := []string{
		".steam/steam",
	}

	for _, onePath := range possibleLocations {
		onePath = filepath.Join(home, onePath)

		if stat, err := os.Stat(onePath); err == nil && stat.IsDir() {
			s.InstallPath = onePath

			return s.FindLibraryFolders()
		}
	}

	return fmt.Errorf("%w: %s", ErrSteamNotFound,
		"could not find Steam installation")
}
