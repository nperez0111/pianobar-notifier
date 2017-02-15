const fileExists = require( 'file-exists' ),
    execa = require( 'execa' ),
    isLocal = () => {
        return fileExists.sync( 'hud.js' )
    },
    findRel = rel => {
        if ( isLocal() ) {
            return Promise.resolve( rel )
        }

        return execa.stdout( 'npm', [ 'root', '-g' ] )
            .then( loc => loc + '/pianobar-notifier/' + rel )
            .catch( rel => {
                throw rel
            } )

    }
module.exports = {
    findRel: findRel
}
