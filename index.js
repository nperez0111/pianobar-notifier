#!/usr/bin/env node

const commandLineCommands = require( 'command-line-commands' ),
    getUsage = require( 'command-line-usage' ),
    usage = getUsage( [ {
        header: 'Pianobar-Notifier',
        content: 'Allows you to interact with Pianobar through notifications and this CLI'
    }, {
        header: 'Command List',
        content: [
            { name: '[bold]{No Params}', summary: 'Displays the current song being played.' },
            { name: '[bold]{start}', summary: 'Starts Pianobar.' },
            { name: '[bold]{help}', summary: 'Display help information about this app.' },
            { name: '[bold]{likeSong}', summary: 'Likes the current song being played.' },
            { name: '[bold]{dislikeSong}', summary: 'Dislikes the current song being played.' },
            { name: '[bold]{nextSong}', summary: 'Plays the next song on Pianobar' },
            { name: '[bold]{selectStations}', summary: 'Brings up notification to change the current station to the one you input.' },
            { name: '[bold]{clearPlaying}', summary: 'If the now playing keeps saying it is paused run this and it will reset.' },
            { name: '[bold]{playPause}', summary: 'Plays or Pauses the current song.' },
            { name: '[bold]{settings}', summary: 'Allows you to change some settings of the notifications.' },
            { name: '[bold]{quit}', summary: 'Quits Pianobar' }
        ]
    } ] ),
    obj = {
        likeSong: () =>
            run( 'likeSong' ),
        dislikeSong: () =>
            run( 'dislikeSong' ),
        nextSong: () =>
            run( 'nextSong' ),
        quit: () =>
            run( 'quitPianobar' ),
        selectStations: () =>
            run( 'selectStations' ),
        playPause: () =>
            run( 'playPause' ),
        display: () =>
            run( 'hud' ),
        settings: () => {
            const settings = require( './settings' )
            settings()
        },
        clearPlaying: () => {
            const playPause = require( './playPause' )
            playPause.clear()
        },
        start: () => {
            run( 'start' )
        },
        help: () => {
            console.log( usage )
        }
    },
    validCommands = [ null ].concat( Object.keys( obj ) ),
    { command, argv } = commandLineCommands( validCommands ),
    run = a => {
        var cp = require( 'child_process' );
        var child = cp.spawn( 'node', [ a + '.js' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();

    }

if ( argv.includes( '-h' ) || argv.includes( '--help' ) || command == 'help' ) {

    console.log( usage )

} else {
    if ( !module.parent && command == null ) {
        run( 'hud' )
    } else {
        obj[ command ]()
    }
}

module.exports = obj
