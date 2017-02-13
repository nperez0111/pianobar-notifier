const notifier = require( 'node-notifier' ),
    log = require( './debug.js' )
module.exports = ( notifyObj, actions = {
    replied: function ( a ) {
        log( "Let's do something with this", val )
    },
    closed: function ( a ) {
        log( "Got Closed :(", a )
    },
    timeout: function ( a ) {
        log( "Welp, we've been timed out..", a )
    },
    activate: function ( a ) {
        log( "User Clicked", a )
    },
    defaultAction: function () {
        log.apply( null, [ "Don't know what happened try looking at this?" ].concat( Array.from( arguments ) ) )
    }
} ) => {


    notifier.notify( notifyObj, function ( err, response, actualResp ) {
        log( arguments )
        if ( err ) {
            actions.defaultAction && actions.defaultAction( err, response, actualResp )
        } else {
            if ( response in actions ) {
                actions[ response ]( actualResp )
            } else {
                log( `Couldn't find ${response} in ${JSON.stringify(actions)}` )
                actions.defaultAction && actions.defaultAction( response, actualResp )
            }
        }

    } )
    return notifier
}
