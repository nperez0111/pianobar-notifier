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
    }
module.exports = {
    findRel: findRel,
    pianoDir: pianoDir,
    findAbs: findAbs
}
