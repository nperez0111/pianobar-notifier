const pidof = require( 'pidof' )

module.exports = () => {
    return new Promise( function ( resolve, reject ) {
        pidof( 'pianobar', function ( err, pid ) {
            if ( err ) {
                reject( err )
                return
            }
            if ( pid ) {
                resolve( pid )
            } else {
                reject( false )
            }
        } )
    } )
}
