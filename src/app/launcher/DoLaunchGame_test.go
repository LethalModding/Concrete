package launcher

import (
	"os"
	"path/filepath"
	"testing"
)

func TestSecureArchivePath(t *testing.T) {
	basePath := t.TempDir()

	tests := []struct {
		name      string
		archive   string
		wantPath  string
		wantError bool
	}{
		{
			name:     "nested file",
			archive:  "BepInEx/plugins/mod.dll",
			wantPath: filepath.Join(basePath, "BepInEx", "plugins", "mod.dll"),
		},
		{
			name:      "parent traversal",
			archive:   "../outside.txt",
			wantError: true,
		},
		{
			name:      "absolute path",
			archive:   filepath.Join(string(os.PathSeparator), "outside.txt"),
			wantError: true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			got, err := secureArchivePath(basePath, test.archive)
			if test.wantError {
				if err == nil {
					t.Fatalf("secureArchivePath(%q) returned %q without an error", test.archive, got)
				}
				return
			}
			if err != nil {
				t.Fatalf("secureArchivePath(%q) returned an error: %v", test.archive, err)
			}
			if got != test.wantPath {
				t.Errorf("secureArchivePath(%q) = %q, want %q", test.archive, got, test.wantPath)
			}
		})
	}
}

func Test_InstallBepInEx(t *testing.T) {
	// Create a new launcher
	l := NewLauncher()

	// Create a temp gamePath
	tmpGamePath, err := os.MkdirTemp("", "Test_InstallBepInEx_gamePath")
	if err != nil {
		t.Errorf("Test_InstallBepInEx failed: %v", err)
		return
	}
	defer os.RemoveAll(tmpGamePath)

	// Create a temp profilePath
	tmpProfilePath, err := os.MkdirTemp("", "Test_InstallBepInEx_profilePath")
	if err != nil {
		t.Errorf("Test_InstallBepInEx failed: %v", err)
		return
	}
	defer os.RemoveAll(tmpProfilePath)

	// Fail on bad gamePath
	if err := l.InstallBepInEx("does_not_exist", ""); err != nil {
		t.Logf("InstallBepInEx failed as expected: %v", err)
	}

	// Fail on bad profilePath
	if err := l.InstallBepInEx(tmpGamePath, "does_not_exist"); err != nil {
		t.Logf("InstallBepInEx failed as expected: %v", err)
	}

	// Success
	if err := l.InstallBepInEx(tmpGamePath, tmpProfilePath); err != nil {
		t.Errorf("InstallBepInEx failed: %v", err)
		return
	}

	// Test winhttp.dll was written to the gamePath
	if _, err := os.Stat(tmpGamePath + "/winhttp.dll"); err != nil {
		t.Errorf("InstallBepInEx failed: %v", err)
	}

	// Test BepInEx was written to the profilePath
	if _, err := os.Stat(tmpProfilePath + "/BepInEx/core/BepInEx.dll"); err != nil {
		t.Errorf("InstallBepInEx failed: %v", err)
	}
}
