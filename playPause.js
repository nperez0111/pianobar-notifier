#!/usr/bin/env node

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
    logToCtl( 'playPauseSong' ),

    singleRun = () =>
    loadJson( file ).then( state => state.playing ).then( isPlaying =>
        run()
        .then( () => writeJson( file, { playing: !isPlaying } ) )
        .then( () => !isPlaying )
    ).then( isPlaying => {
        return playOrPause( isPlaying )
    } ),

    playOrPause = action => {
        return loadJson( file ).then( state => state.playing ).then( isPlaying => {
            if ( isPlaying === action ) {
                console.log( 'Is already doing the action specified' )
                return action
            }
            return run()
                .then( () => writeJson( file, { playing: action } ) ).then( () => action )
        } ).then( isPlaying => {
            return simple( isPlaying ? 'isPlaying' : 'isPaused', {
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



if ( !module.parent ) {

    singleRun()

}

module.exports = run
module.exports.clear = () => {
    return writeJson( file, { playing: true } )
}
module.exports.singleRun = singleRun
module.exports.play = () => playOrPause( true )
module.exports.pause = () => playOrPause( false )
