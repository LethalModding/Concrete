package gui

import log "github.com/AlbinoGeek/logxi/v1"

func (a *App) StdLogger() LogxiStdLogger {
	return LogxiStdLogger{
		logger: a.logger,
	}
}

type LogxiStdLogger struct {
	logger log.Logger
}

func (l LogxiStdLogger) Print(message string) {
	l.logger.Info(message)
}

func (l LogxiStdLogger) Trace(message string) {
	l.logger.Trace(message)
}

func (l LogxiStdLogger) Debug(message string) {
	l.logger.Debug(message)
}

func (l LogxiStdLogger) Info(message string) {
	l.logger.Info(message)
}

func (l LogxiStdLogger) Warning(message string) {
	l.logger.Warn(message)
}

func (l LogxiStdLogger) Error(message string) {
	l.logger.Error(message)
}

func (l LogxiStdLogger) Fatal(message string) {
	l.logger.Fatal(message)
}
