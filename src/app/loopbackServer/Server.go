package loopbackServer

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Server is a local web server that listens for OAuth2 redirects.
type Server struct {
	echo    *echo.Echo
	port    int
	running bool
}

// NewServer creates a new Server instance.
func NewServer(port int) *Server {
	return &Server{
		port: port,
	}
}

// Start starts the local web server.
func (s *Server) Start() error {
	s.echo = echo.New()

	// s.echo.Use(middleware.Logger())
	s.echo.Use(middleware.Recover())

	s.echo.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	s.echo.HideBanner = true
	err := s.echo.Start(strings.Split(s.URL(), "://")[1])

	s.running = true
	for s.running {
		// Wait for the server to stop
	}

	return err
}

// Stop stops the local web server.
func (s *Server) Stop() error {
	s.running = false // Unset the running flag

	return s.echo.Close()
}

// URL returns the URL of the local web server.
func (s *Server) URL() string {
	return fmt.Sprintf("http://localhost:%d", s.port)
}
