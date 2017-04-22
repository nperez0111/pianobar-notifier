const fileExists = require( 'file-exists' ),
    execa = require( 'execa' ),
    isLocal = () => {
        return fileExists.sync( 'isPianobarOn.js' )
    },
    findRel = rel => {
        if ( isLocal() ) {
            return Promise.resolve( rel )
        }

        return execa.stdout( 'npm', [ 'root', '-g' ] )
            .then( loc => loc + '/pianobar-notifier/' + rel )
            .catch( re => {
                throw rel
            } )

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
