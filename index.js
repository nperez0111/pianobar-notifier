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
            run( 'likeSong', require( './likeSong' ).singleRun ),
        dislikeSong: () =>
            run( 'dislikeSong', require( './dislikeSong' ).singleRun ),
        nextSong: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        next: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        quit: () => {
            return require( './quitPianobar' ).singleRun() },
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
        }
    },
    validCommands = [ null ].concat( Object.keys( obj ) ),
    { command, argv } = commandLineCommands( validCommands ),
    fileExists = require( 'file-exists' ),
    isLocal = () => {
        return fileExists.sync( 'hud.js' )
    },
    exec = file => {
        var cp = require( 'child_process' );
        var child = cp.spawn( 'node', [ file + '.js' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();
    }
run = ( file, executor ) => {
    if ( isLocal() ) {
        exec( file )
    } else {
        execa.stdout( 'npm', [ 'root', '-g' ] )
            .then( loc => loc + '/pianobar-notifier/' + file )
            .then( loc => {
                exec( loc )
            } ).catch( () => {
                console.log( "Going the slow route" )
                return executor()
            } )
    }
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
