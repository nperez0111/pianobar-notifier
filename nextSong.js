#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'nextSong' )
if ( !module.parent ) {
    run()
    simple( 'nextSong' )
}

module.exports = run
