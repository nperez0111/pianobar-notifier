const log = require( './debug.js' ),
    loadJson = require( 'load-json-file' ),
    fs = require( 'fs' ),
    util = require( 'util' ),
    logToAFile = file => {
        const log_file = fs.createWriteStream( file, { flags: 'w' } )
        return {
            log: function ( line ) {
                log_file.write( util.format( line ) );
            },
            logLine: function ( line ) {
                log_file.write( util.format( line ) + '\n' );
            },
            newLine: function () {
                log_file.write( '\n' )
            }
        }
    },
    { findAbs } = require( './shared' ),
    ctl = findAbs( 'settings.json' ).then( loc => loadJson( loc )
        .then( settings => settings.ctlLoc )
        .then( ctlLoc => logToAFile( ctlLoc ) ) )
    .catch( a => { console.log( "Error: Whoops...\nTry running `notifier settings` to regenerate the settings file." ) } ),
    symbol = require( './mappings' )


module.exports = which => ctl.then( obj => obj.log( symbol[ which ] ) )
module.exports.log = line => ctl.then( obj => obj.log( line ) )
module.exports.newLine = () => { ctl.then( obj => obj.newLine() ) }
module.exports.logLine = line => ctl.then( obj => obj.logLine( line ) )
