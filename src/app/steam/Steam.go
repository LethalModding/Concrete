package steam

import "errors"

var (
	// ErrSteamNotFound is returned when the Steam installation cannot be found.
	ErrSteamNotFound = errors.New("Steam installation could not be found")

	// ErrUnsupportedOS is returned when the OS is not supported.
	ErrUnsupportedOS = errors.New("your operating system is not supported")
)

// Steam represents a Steam installation on your system.
type Steam struct {
	// InstallPath is the path to the Steam installation.
	InstallPath string `json:"installPath"`

	// LibraryFolders is a list of paths to Steam library folders.
	LibraryFolders []string `json:"libraryFolders"`
}

// NewSteam creates a new Steam installation handler.
func NewSteam() *Steam {
	return &Steam{
		LibraryFolders: make([]string, 0),
	}
}
