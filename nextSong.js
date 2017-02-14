#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple.run( 'nextSong' ),
    singleRun = () => {
        run()
        simple( 'nextSong' )
    }
if ( !module.parent ) {
    singleRun()
}

module.exports = run
module.exports.singleRun = singleRun
