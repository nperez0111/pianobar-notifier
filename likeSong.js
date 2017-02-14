#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'likeSong' ),
    singleRun = () => {
        run()
        simple( 'likeSong' )
    }
if ( !module.parent ) {
    singleRun()
}

module.exports = run
module.exports.singleRun = singleRun
