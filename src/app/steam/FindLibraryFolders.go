package steam

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/andygrunwald/vdf"
)

var libraryFoldersVDF = "libraryfolders.vdf"

// FindLibraryFolders attempts to locate the Steam library folders on your system.
//
// We use the Steam installation to find the library folders. If the Steam
// library folders cannot be found, an error is returned.
func (s *Steam) FindLibraryFolders() error {
	libraryFolders := make([]string, 0)
	f, err := os.Open(filepath.Join(s.InstallPath, "steamapps", libraryFoldersVDF))
	if err != nil {
		return fmt.Errorf("%w: %s: %v", ErrSteamNotFound,
			"could not read Steam library folders", err)
	}
	defer f.Close()

	// Parse the file
	parser := vdf.NewParser(f)
	vdfMap, err := parser.Parse()
	if err != nil {
		return fmt.Errorf("%w: %s: %v", ErrSteamNotFound,
			"could not parse Steam library folders", err)
	}

	vdfMap = vdfMap["libraryfolders"].(map[string]interface{})
	for _, entry := range vdfMap {
		this := entry.(map[string]interface{})
		if this["path"] == nil {
			continue
		}

		libraryFolders = append(libraryFolders, this["path"].(string))
	}

	// Set the library folders
	s.LibraryFolders = libraryFolders

	return nil
}
