//go:build windows
// +build windows

package steam

import (
	"fmt"

	"golang.org/x/sys/windows/registry"
)

var registryKeys = []string{
	`SOFTWARE\Wow6432Node\Valve\Steam`,
	`SOFTWARE\Valve\Steam`,
}

// Find attempts to locate the Steam installation on your system.
//
// It uses the OS-specific find function to locate the Steam installation, and
// then uses the Steam installation to find the library folders. If the Steam
// installation cannot be found, an error is returned.
func (s *Steam) Find() error {
	var lastErr error

	for _, key := range registryKeys {
		k, err := registry.OpenKey(registry.LOCAL_MACHINE, key, registry.QUERY_VALUE)
		if err != nil {
			lastErr = err
			continue
		}
		defer k.Close()

		installPath, _, err := k.GetStringValue("InstallPath")
		if err != nil {
			lastErr = err
			continue
		}

		s.InstallPath = installPath

		return s.FindLibraryFolders()
	}

	return fmt.Errorf("%w: %s: %v", ErrSteamNotFound,
		"could not find Steam installation", lastErr)
}
