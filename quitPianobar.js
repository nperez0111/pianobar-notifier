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

    },
    singleRun = () => {
        run()
        simple( 'quit' )
    }
if ( !module.parent ) {
    singleRun()
}

module.exports = run
module.exports.singleRun = singleRun
