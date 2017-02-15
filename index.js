#!/usr/bin/env node

const commandLineCommands = require( 'command-line-commands' ),
    getUsage = require( 'command-line-usage' ),
    execa = require( 'execa' ),
    usage = getUsage( [ {
        header: 'Pianobar-Notifier',
        content: 'Allows you to interact with Pianobar through notifications and this CLI'
    }, {
        header: 'Command List',
        content: [
            { name: '[bold]{No Params}', summary: 'Displays the current song being played.' },
            { name: '[bold]{display}', summary: 'Same as above.' },
            { name: '[bold]{start}', summary: 'Starts Pianobar.' },
            { name: '[bold]{help}', summary: 'Display help information about this app.' },
            { name: '[bold]{likeSong}', summary: 'Likes the current song being played.' },
            { name: '[bold]{dislikeSong}', summary: 'Dislikes the current song being played.' },
            { name: '[bold]{nextSong}', summary: 'Plays the next song on Pianobar' },
            { name: '[bold]{selectStations}', summary: 'Brings up notification to change the current station to the one you input.' },
            { name: '[bold]{clearPlaying}', summary: 'If the now playing keeps saying it is paused run this and it will reset.' },
            { name: '[bold]{playPause}', summary: 'Plays or Pauses the current song.' },
            { name: '[bold]{play}', summary: 'Resume the current song if paused.' },
            { name: '[bold]{pause}', summary: 'Pauses the current song if playing.' },
            { name: '[bold]{settings}', summary: 'Allows you to change some settings of the notifications.' },
            { name: '[bold]{login}', summary: 'Shows login message.' },
            { name: '[bold]{quit}', summary: 'Quits Pianobar' }
        ]
    } ] ),
    obj = {
        likeSong: () =>
            run( 'likeSong', require( './likeSong' ).singleRun ),
        dislikeSong: () =>
            run( 'dislikeSong', require( './dislikeSong' ).singleRun ),
        nextSong: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        next: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        quit: () => {
            return require( './quitPianobar' ).singleRun()
        },
        selectStations: () =>
            run( 'selectStations', require( './selectStations' ).singleRun ),
        playPause: () =>
            run( 'playPause', require( './playPause' ).singleRun ),
        play: () => {
            const playPause = require( './playPause' )
            playPause.play()
        },
        pause: () => {
            const playPause = require( './playPause' )
            playPause.pause()
        },
        display: () =>
            run( 'hud', require( './hud' ) ),
        settings: () =>
            require( './settings' )(),
        clearPlaying: () => {
            const playPause = require( './playPause' )
            playPause.clear()
        },
        start: () => {
            run( 'start', require( './start' ).singleRun )
        },
        help: () => {
            console.log( usage )
        },
        login: () => {
            require( './simpleTask' )( 'login' )
        }
    },
    validCommands = [ null ].concat( Object.keys( obj ) ),
    shared = require( './shared' ),
    findRel = shared.findRel,
    exec = file => {
        var cp = require( 'child_process' );
        var child = cp.spawn( 'node', [ file + '.js' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();
    },
    run = ( file, executor ) => {
        findRel( file ).then( abs => {
            exec( abs )
        } ).catch( executor )
    }

let command = null,
    argv = [ '-h' ];
try {
    const l = commandLineCommands( validCommands )
    command = l.command
    argv = l.argv
} catch ( e ) {
    console.log( "Invalid Command... " )
}

if ( argv.includes( '-h' ) || argv.includes( '--help' ) || command == 'help' ) {

    console.log( usage )

} else {
    if ( !module.parent && command == null ) {
        obj.display()
    } else {
        obj[ command ]()
    }
}

module.exports = obj
