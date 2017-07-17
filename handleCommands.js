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
            { name: '[bold]{No Params}', summary: 'Displays the current song being played. Or if pianobar is closed will start pianobar' },
            { name: '[bold]{display}', summary: 'Same as above.' },
            { name: '[bold]{start}', summary: 'Starts Pianobar.' },
            { name: '[bold]{help}', summary: 'Display help information about this app.' },
            { name: '[bold]{like[Song]}', summary: 'Likes the current song being played.' },
            { name: '[bold]{dislike[Song]}', summary: 'Dislikes the current song being played.' },
            { name: '[bold]{nextSong}', summary: 'Plays the next song on Pianobar' },
            { name: '[bold]{selectStation}', summary: 'Brings up notification to change the current station to the one you input.' },
            { name: '[bold]{clearPlaying}', summary: 'If the now playing keeps saying it is paused run this and it will reset.' },
            { name: '[bold]{playPause}', summary: 'Plays or Pauses the current song.' },
            { name: '[bold]{play}', summary: 'Resume the current song if paused.' },
            { name: '[bold]{pause}', summary: 'Pauses the current song if playing.' },
            { name: '[bold]{settings}', summary: 'Allows you to change some settings of the notifications.' },
            { name: '[bold]{login}', summary: 'Shows login message.' },
            { name: '[bold]{isOn}', summary: 'exits with 0 if on and exits 1 if not on' },
            { name: '[bold]{quit}', summary: 'Quits Pianobar' }
        ]
    } ] ),
    obj = {
        likeSong: () =>
            run( 'likeSong', require( './likeSong' ).singleRun ),
        like: () =>
            run( 'likeSong', require( './likeSong' ).singleRun ),
        dislike: () =>
            run( 'dislikeSong', require( './dislikeSong' ).singleRun ),
        dislikeSong: () =>
            run( 'dislikeSong', require( './dislikeSong' ).singleRun ),
        nextSong: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        next: () =>
            run( 'nextSong', require( './nextSong' ).singleRun ),
        quit: () => {
            return require( './quitPianobar' ).singleRun()
        },
        selectStation: () =>
            run( 'selectStation', require( './selectStation' ).singleRun ),
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
        display: () => {
            run( 'hud', require( './hud' ) )
        },
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
            run( 'login', require( './login' ).singleRun )
        },
        isOn: () => {
            require( './isPianobarOn' )().then( () => {
                process.exit( 0 );
            } ).catch( () => {
                process.exit( 1 )
            } )
        }
    },
    validCommands = [ null ].concat( Object.keys( obj ) ),
    { findRel, log } = require( './shared' ),
    exec = file => {
        var cp = require( 'child_process' );
        var child = cp.spawn( 'node', [ file + '.js' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();
    },
    run = ( file, executor ) => {
        findRel( file ).then( abs => {
            exec( abs )
        } ).catch( executor )
    },
    main = args => {
        var command = null,
            argv = [ '-h' ];
        try {
            var { command, argv } = commandLineCommands( validCommands, args )

        } catch ( e ) {
            console.log( "Invalid Command... " )
        }

        if ( argv.includes( '-h' ) || argv.includes( '--help' ) || command == 'help' ) {

            console.log( usage )

        } else {
            if ( command == null ) {
                //log( 'No command provided...' )
                require( './isPianobarOn' )().then( () => obj.display() ).catch( () => {
                    obj.start()
                } )
            } else {
                obj[ command ]()
            }
        }
    }
if ( !module.parent ) {
    main()
}
process.on( 'unhandledRejection', ( reason ) => {
    console.log( 'Reason: ' + reason );
} );
module.exports = obj
module.exports.main = args => main( Array.from( args ).slice( 2 ) )
