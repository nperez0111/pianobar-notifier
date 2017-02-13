const fs = require( 'fs' ),
    util = require( 'util' ),
    log_file = fs.createWriteStream( __dirname + '/debug.log', { flags: 'w' } ),
    log_stdout = process.stdout;

module.exports = function () {
    Array.from( arguments ).forEach( function ( d ) {
        log_file.write( util.format( d ) + '\n' );
        log_stdout.write( util.format( d ) + '\n' );
    } )

};
