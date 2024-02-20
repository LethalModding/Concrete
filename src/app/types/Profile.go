package types

import (
	"encoding/json"
	"time"

	uuid "github.com/satori/go.uuid"
)

type Profile struct {
	ID string `json:"id"`

	Created int64 `json:"created"`
	Deleted int64 `json:"deleted,omitempty"`
	Updated int64 `json:"updated,omitempty"`

	Name    string `json:"name"`
	Owner   string `json:"owner"`
	Version string `json:"version"`

	Cover       string   `json:"cover,omitempty"`
	Description string   `json:"description,omitempty"`
	GameVersion string   `json:"gameVersion,omitempty"`
	Tags        []string `json:"tags,omitempty"`

	DisabledMods []string `json:"disabledMods,omitempty"`
	EnabledMods  []string `json:"enabledMods"`
	Instructions string   `json:"instructions,omitempty"`

	Order   int  `json:"order"`
	Visible bool `json:"visible"`
}

func NewProfile() *Profile {
	return &Profile{
		ID:      uuid.NewV4().String(),
		Created: time.Now().Unix(),

		Name:    "New Profile",
		Owner:   "local",
		Version: "0.1.0",

		EnabledMods: []string{},

		Order:   0,
		Visible: true,
	}
}

func UnmarshalProfile(data []byte) (*Profile, error) {
	profile := &Profile{}
	err := json.Unmarshal(data, profile)

	return profile, err
}
