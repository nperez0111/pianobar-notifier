#!/usr/bin/env node

const simple = require( './simpleTask' ),
    run = () => simple( 'login' ),
    { log } = require( './shared' ),
    singleRun = () => {
        run()
    }
if ( !module.parent ) {

    singleRun()
}

module.exports = run
module.exports.singleRun = singleRun
