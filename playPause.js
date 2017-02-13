const logToCtl = require( './logToCtl' ),
    notifier = require( './notifications' ),
    loadJson = require( 'load-json-file' ),
    writeJson = require( 'write-json-file' ),
    file = "playing.json",
    camelCase = require( 'camelcase' ),
    ifHasElseDefaultAction = ( propObj, prop, ...args ) => {
        if ( prop in propObj ) {
            propObj[ prop ].apply( null, args )
        } else {
            propObj.defaultAction.apply( null, args )
        }
    },
    simple = require( './simpleTask' )

const run = () =>
    logToCtl( 'playPauseSong' )


if ( !module.parent ) {

    loadJson( file ).then( state => state.playing ).then( isPlaying =>
        run()
        .then( () => writeJson( file, { playing: !isPlaying } ) )
        .then( () => !isPlaying )
    ).then( isPlaying => {
        simple( isPlaying ? 'isPlaying' : 'isPaused', {
            activate: action => {
                ifHasElseDefaultAction( {
                    pauseTrack: () => {
                        console.log( "Pausing Track..." )
                        run()
                    },
                    playTrack: () => {
                        console.log( "Playing Track..." )
                        run()
                    },
                    defaultAction: ( a ) => {
                        console.log( "Action not accounted for", a )
                    }
                }, camelCase( action.activationValue ) )
            }
        }, {
            actions: isPlaying ? 'Pause Track' : 'Play Track'
        } )
    } )

}

module.exports = run
module.exports.clear = () => {
    return writeJson( file, { playing: true } )
}
