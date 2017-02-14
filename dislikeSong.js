#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'dislikeSong' )
if ( !module.parent ) {
    run()
    simple( 'dislikeSong' )
}

module.exports = run
