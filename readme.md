# Pianobar-Notifier

### Check out [my installer](https://github.com/nperez0111/pianobar-installer-js) OR my [other installer](https://github.com/nperez0111/pianobar-installer)
## Purpose of this project
To give notifications of the current state of pianobar, the console player for pandora. Also allows you to interact with pianobar via the notification bubbles allowing you to choose stations like dislike and skip songs.
### Nitty-Gritty
#### handleCommands.js
This handles the command line options and chooses the correct option that the user is attempting to run
#### getStations.js
This processes the stdin that pianobar outputs to its eventcmd into a list of stations
#### [like|dislike|next]Song.js
if ran as standalone will like or dislike the current song
#### hud.js
loads the settings and cur song from their respective json files and displays a hud with options to do other actions
#### isPianobarOn.js
tells you whether pianobar is running or not
#### notifications.js
Handles the other notifications for various states of pianobar
#### playPause.js
Toggles play or pause on current song
#### quitPianobar.js
Quits pianobar
#### selectStation.js
Allows selecting a station
#### settings.js
Asks questions in order to generate settings in the way you like
#### start.js
runs pianobar simply
#### Run.js
The purpose of this file is to showcase how you can run `pianobar` in headless mode and be able to strip out the current time and place the current progress into `nowplaying.json`
