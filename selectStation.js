#!/usr/bin/env node

const notifier = require( './notifications' ),
    log = require( './debug.js' ),
    ctl = require( './logToCtl' ),
    loadJsonFile = require( 'load-json-file' ),
    getStations = require( './getStations' ),
    simple = require( './simpleTask' ),
    findAbs = require( './shared' ).findAbs

const actions = {
    replied: function ( a ) {
        const getVal = obj => obj.activationValue
        const val = getVal( a )
        log( "lets do something with this", val )
        ctl( 'selectStation' )
            //puts into select station mode
        ctl.logLine( val )
    },
    closed: function ( a ) {

    },
    timeout: function ( a ) {
        log( "welp it timed out..", a )
    },
    activate: function ( action ) {
        if ( action.activationType == 'actionClicked' ) {
            const val = action.activationValue
            ctl( 'selectStation' ).then( () => {
                ctl.logLine( val )
            } )

        }
        log( "user clicked", action )
    },
    defaultAction: function () {
        log.apply( null, [ "dont know what happened try looking at this?" ].concat( Array.from( arguments ) ) )
    }
}

const run = () => {

    return findAbs( 'cur.json' ).then( file => loadJsonFile( file ) ).then( cur => {

        return simple( 'selectStation', actions, { actions: getStations( cur ) } )

    } )

}

if ( !module.parent ) {
    run()
}

module.exports = run
