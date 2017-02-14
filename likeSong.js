#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'likeSong' )
if ( !module.parent ) {
    run()
    simple( 'likeSong' )
}

module.exports = run
