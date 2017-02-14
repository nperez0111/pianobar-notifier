#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'dislikeSong' ),
    singleRun = () => {
        run()
        simple( 'dislikeSong' )
    }
if ( !module.parent ) {
    singleRun()
}

module.exports = run
module.exports.singleRun = singleRun
