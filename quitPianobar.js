#!/usr/bin/env node

const simple = require( './simpleTask' ),
    spawn = require( 'child_process' ).spawn,
    run = () => {
        simple.run( 'quit' )
        setTimeout( function () {
            const pidof = spawn( 'pidof', [ "pianobar" ] )
            pidof.stdout.on( 'data', ( data ) => {
                spawn( "kill", [ data ] )
            } );
        }, 20 )
    }
if ( !module.parent ) {
    run()
    simple( 'quit' )
}

module.exports = run
