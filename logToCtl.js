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
    ctl = loadJson( 'settings.json' )
    .then( settings => settings.ctlLoc )
    .then( ctlLoc => logToAFile( ctlLoc ) )
    .catch( a => { console.log( "Check the directory specified in 'ctlLoc' the settings.json file it may not exist" ) } ),
    symbol = require( './mappings' )


module.exports = which => ctl.then( obj => obj.log( symbol[ which ] ) )
module.exports.log = line => ctl.then( obj => obj.log( line ) )
module.exports.newLine = () => { ctl.then( obj => obj.newLine() ) }
module.exports.logLine = line => ctl.then( obj => obj.logLine( line ) )
