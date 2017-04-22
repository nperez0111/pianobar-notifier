#!/usr/bin/env node

var spawn = require( 'child_process' ).spawn,
    debug = require( './debug' ),
    pianobar = spawn( 'pianobar' ),
    writeJson = require( 'write-json-file' ),
    { findAbs, findRel } = require( './shared' ),
    getStdin = require( 'get-stdin' )

pianobar.stdout.setEncoding( 'utf8' );

pianobar.stdout.on( 'data', function ( data ) {
    var get = /(\d\d:\d\d).(\d\d:\d\d)/
    if ( get.test( data ) ) {
        const [ now, ofTotal ] = Array.from( data.match( get ) ).slice( 1 )
        findRel( 'nowPlaying.json' ).then( nowPlaying => writeJson( nowPlaying, { current: now, ofTotal: ofTotal } ) )
    } else {
        console.log( data )
    }
} );
pianobar.stdout.on( 'end', function () {
    console.log( "out put ended" )
} )
