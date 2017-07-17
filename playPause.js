#!/usr/bin/env node

const logToCtl = require( './logToCtl' ),
    notifier = require( './notifications' ),
    loadJson = require( 'load-json-file' ),
    writeJson = require( 'write-json-file' ),
    isOn = require( './isPianobarOn' ),
    start = require( './start' ),
    Conf = require( 'conf' ),
    config = new Conf(),
    key = "playing",
    camelCase = require( 'camelcase' ),
    ifHasElseDefaultAction = ( propObj, prop, ...args ) => {
        if ( prop in propObj ) {
            propObj[ prop ].apply( null, args )
        } else {
            propObj.defaultAction.apply( null, args )
        }
    },
    simple = require( './simpleTask' ),
    checkIfOn = func => isOn().then( func ).catch( err => {
        if ( err !== false ) {
            return func()
        } else {
            return start()
        }
    } )

const run = () => checkIfOn( () => logToCtl( 'playPauseSong' ) ),

    singleRun = () => checkIfOn( () =>
        Promise.resolve( config.get( key ) ).then( isPlaying =>
            run()
            .then( () => config.set( key, !isPlaying ) )
            .then( () => !isPlaying )
        ).then( isPlaying => {
            return playOrPause( isPlaying )
        } ) ),

    playOrPause = action => {
        return checkIfOn( () => Promise.resolve( config.get( key ) ).then( isPlaying => {
            if ( isPlaying === action ) {
                return action
            }
            return run()
                .then( () => config.set( key, action ) ).then( () => action )
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

        } ) )
    }



if ( !module.parent ) {

    singleRun()

}

module.exports = run
module.exports.clear = () => {
    return config.set( key, true )
}
module.exports.singleRun = singleRun
module.exports.play = () => playOrPause( true )
module.exports.pause = () => playOrPause( false )
