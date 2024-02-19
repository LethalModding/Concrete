package types

import "strconv"

type Config struct {
	DismissLogin       bool   `json:"dismissLogin"`
	LibraryPath        string `json:"libraryPath"`
	LoopbackServerPort int    `json:"loopbackServerPort"`
	SteamPath          string `json:"steamPath"`
}

func NewConfig() *Config {
	return &Config{
		LoopbackServerPort: 45816,
		SteamPath:          "C:\\Program Files (x86)\\Steam",
	}
}

func (c *Config) Get(key string) string {
	switch key {
	case "DismissLogin":
		return strconv.FormatBool(c.DismissLogin)
	case "LibraryPath":
		return c.LibraryPath
	case "LoopbackServerPort":
		return strconv.Itoa(c.LoopbackServerPort)
	case "SteamPath":
		return c.SteamPath
	}

	return ""
}

func (c *Config) Set(key string, value string) {
	switch key {
	case "DismissLogin":
		if b, err := strconv.ParseBool(value); err == nil {
			c.DismissLogin = b
		}
	case "LibraryPath":
		c.LibraryPath = value
	case "LoopbackServerPort":
		if num, err := strconv.Atoi(value); err == nil {
			c.LoopbackServerPort = num
		}
	case "SteamPath":
		c.SteamPath = value
	}
}
