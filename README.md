# colorprofilesourcemanager
## Description
A KWin script that automatically disable &amp; restore icc profile when certain windows are active and fullscreen to allow direct scanout.

## Dependencies
This script assumes the dbus service `nl.dvdgiessen.dbusapplauncher` exists. It is used to run shell command.

This script runs `kscreen-doctor` when changing color profile source.
