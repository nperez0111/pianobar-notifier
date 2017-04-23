#!/usr/bin/env node

const getStdin = require( 'get-stdin' ),
    log = require( './debug' ),
    commandLineCommands = require( 'command-line-commands' ),
    writeJson = require( 'write-json-file' ),
    { findAbs, createObj } = require( './shared' ),
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
            //console.log( 'usergetstations' )
        },
        stationfetchplaylist: () => {
            //console.log( 'stationfetchplaylist' )
        },
        songstart: () => {
            //console.log( 'songstart' )
            handleCommands.clearPlaying()
            handleCommands.display()

        },
        songfinish: () => {
            //console.log( 'songfinish' )
            handleCommands.clearPlaying()
        },
        default: ( command ) => {
            console.log( command + " is not handled" )
        }
    },
    ifEmptyThrow = a => {
        if ( a == '' ) {
            throw ""
        }
        return a
    }

if ( !module.parent ) {
    getStdin().then( ifEmptyThrow ).then( fromStdin ).then( currentJSON => {
        //stores current song into json file
        return findAbs( 'cur.json' ).then( loc => writeJson( loc, currentJSON ) ).then( () => currentJSON )
    } ).then( currentSong => {
        var command = '',
            argv = ''
        try {
            var { command, argv } = commandLineCommands( [ null ].concat( Object.keys( obj ) ) )
        } catch ( e ) {}
        if ( command in obj ) {
            obj[ command ]()
        } else {
            obj.default( command )
        }
    } ).catch( () => {

        handleCommands.main( process.argv )
    } )
}
module.exports = fromStdin
