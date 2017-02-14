#!/usr/bin/env node

const simple = require( './simpleTask' ),
    execa = require( 'execa' ),
    pid = require( './isPianobarOn' ),
    run = () => {
        simple.run( 'quit' )
        setTimeout( function () {
            pid().then( pid => {
                execa( 'kill', [ pid ] )
            } ).catch( () => {
                //couldn't find pid lets just do this again to try to kill it
                simple.run( 'quit' )
            } )
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
