const
    execa = require( 'execa' ),
    findRel = rel => {
        try {
            return Promise.resolve( require.resolve( rel ) )
        } catch ( err ) {
            return Promise.reject( rel )
        }

    },
    homedir = require( 'homedir' )(),
    pianoDir = homedir + '/.config/pianobar/',
    findAbs = file => {
        return Promise.resolve( pianoDir + file )
    },
    createObj = ( keys, values ) => {
        var ret = {};
        if ( Array.isArray( keys ) && Array.isArray( values ) ) {
            keys.forEach( function ( cur, i ) {
                ret[ cur ] = values[ i ];
            } );

        } else {
            ret[ keys ] = values;
        }
        return ret;
    },
    log = require( './debug.js' )
module.exports = {
    findRel,
    pianoDir,
    findAbs,
    createObj,
    log
}
