#!/usr/bin/env node

const run = a => {
    var cp = require( 'child_process' );
    var child = cp.spawn( 'node', [ ( process.argv[ 2 ] || a ) + '.js' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
    child.unref();
}
if ( !module.parent ) {
    run( 'hud' )
}
module.exports = {
    likeSong: () =>
        run( 'likeSong' ),
    dislikeSong: () =>
        run( 'dislikeSong' ),
    nextSong: () =>
        run( 'nextSong' ),
    quit: () =>
        run( 'quitPianobar' ),
    getStations: () =>
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
    }
}
