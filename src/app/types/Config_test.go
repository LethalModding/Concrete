package types

import (
	"sync"
	"testing"
)

func TestConfigConcurrentGetAndSet(t *testing.T) {
	config := NewConfig()

	var waitGroup sync.WaitGroup
	for range 4 {
		waitGroup.Add(2)

		go func() {
			defer waitGroup.Done()
			for range 1000 {
				config.Set("LibraryPath", "library")
			}
		}()

		go func() {
			defer waitGroup.Done()
			for range 1000 {
				_ = config.Get("LibraryPath")
			}
		}()
	}

	waitGroup.Wait()
}
