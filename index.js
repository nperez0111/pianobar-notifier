#!/usr/bin/env node

const getStdin = require( 'get-stdin' ),
    log = require( './debug' ),
    commandLineCommands = require( 'command-line-commands' ),
    fromStdin = text => {
        const [ keys, values ] = text.split( '\n' ).reduce( ( prev, line ) => {
            let [ key, ...value ] = line.split( '=' )

            if ( key !== '' ) {
                prev[ 0 ].push( key )
                prev[ 1 ].push( value.join( '=' ) )
            }
            return prev
        }, [
            [],
            []
        ] )

        return createObj( keys, values )
    },
    handleCommands = require( './handleCommands' ),
    obj = {
        userlogin: () => {
            handleCommands.login()
        },
        usergetstations: () => {
            console.log( 'usergetstations' )
        },
        stationfetchplaylist: () => {
            console.log( 'stationfetchplaylist' )
        },
        songstart: () => {
            console.log( 'songstart' )
            handleCommands.clearPlaying()
            handleCommands.display()

        },
        songfinish: () => {
            console.log( 'songfinish' )
        }
    },
    ifEmptyThrow = a => {
        if ( a == '' ) {
            throw ""
        }
        return a
    }

function createObj( keys, values ) {
    var ret = {};
    if ( Array.isArray( keys ) && Array.isArray( values ) ) {
        keys.forEach( function ( cur, i ) {
            ret[ cur ] = values[ i ];
        } );

    } else {
        ret[ keys ] = values;
    }
    return ret;
}
if ( !module.parent ) {
    getStdin().then( ifEmptyThrow ).then( fromStdin ).then( currentSong => {
        var command = '',
            argv = ''
        try {
            var { command, argv } = commandLineCommands( [ null ].concat( Object.keys( obj ) ) )
        } catch ( e ) {}
        obj[ command ]()
    } ).catch( () => {
        handleCommands.main( process.argv )
    } )
}
module.exports = fromStdin
