#!/usr/bin/env node

const notifier = require( './notifications' ),
    imageDownloader = require( 'image-downloader' ),
    loadJsonFile = require( 'load-json-file' ),
    camelCase = require( 'camelcase' ),
    spawn = require( 'child_process' ).spawn,
    open = spawn.bind( spawn, 'open' ),
    ifHasElseDefaultAction = ( propObj, prop, ...args ) => {
        if ( prop in propObj ) {
            propObj[ prop ].apply( null, args )
        } else {
            propObj.defaultAction.apply( null, args )
        }
    },
    selectStation = require( './selectStation' ),
    nextSong = require( './nextSong' ),
    pauseSong = require( './playPause' ).pause,
    likeSong = require( './likeSong' ),
    dislikeSong = require( './dislikeSong' ),
    quit = require( './quitPianobar' ),
    { findAbs } = require( './shared' ),
    run = () => {

        return findAbs( 'settings.json' ).then( settings => loadJsonFile( settings ) ).then( json => {

            return findAbs( 'cur.json' ).then( file => loadJsonFile( file ) ).then( prefs => {


                ( ( { albumArt, song, album, radio, artist, icon, url, timing } ) => findAbs( 'albumArt.jpg' ).catch( a => process.cwd() + a ).then( file => ( new Promise( function ( resolve, error ) {
                    imageDownloader( {
                        url: albumArt,
                        dest: file,
                        done: function ( err, filename, image ) {
                            if ( err ) {
                                error( err )
                            }
                            resolve( filename )
                        }
                    } )
                } ) ) ).then( filename => {

                    notifier( {
                        title: song,
                        subtitle: artist,
                        message: `On:${album}, ${radio}`,
                        icon: icon,
                        contentImage: filename,
                        closeLabel: "Quit",
                        timeout: timing,
                        actions: [ 'Next Song', 'Pause Song', 'Like Song', 'Dislike Song', 'Select Station' ]
                    }, {
                        closed: function () {
                            console.log( 'quitting' )
                            quit()
                        },
                        activate: function ( type ) {
                            ifHasElseDefaultAction( {

                                contentsClicked: function () {
                                    ifHasElseDefaultAction( {
                                        url: () => {
                                            open( [ url ] )
                                        },
                                        defaultAction: () => {
                                            //app or otherwise

                                            ifHasElseDefaultAction( {
                                                bundle: function () {
                                                    open( [ '-b', json.onClick.open ] )
                                                },
                                                defaultAction: function () {
                                                    //app or otherwise
                                                    open( [ '-a', json.onClick.open ] )
                                                }
                                            }, json.onClick.identifier )

                                        }
                                    }, json.onClick.open )
                                },
                                actionClicked: ( val ) => {
                                    ifHasElseDefaultAction( {
                                        likeSong: () => {
                                            likeSong()
                                        },
                                        dislikeSong: () => {
                                            dislikeSong()
                                        },
                                        nextSong: () => {
                                            nextSong()
                                        },
                                        selectStation: () => {
                                            selectStation()
                                        },
                                        pauseSong: () => {
                                            pauseSong()
                                        },
                                        defaultAction: () => {
                                            //nothing needed
                                        }
                                    }, camelCase( val ) )

                                }
                            }, type.activationType, type.activationValue )
                        }
                    } )

                } ).catch( err => { console.log( err ) } ) )( {
                    albumArt: prefs.coverArt,
                    url: prefs.detailUrl,
                    artist: prefs.artist,
                    song: prefs.title,
                    album: prefs.album,
                    radio: prefs.songStationName || prefs.stationName,
                    icon: json.icon,
                    timing: json.timing
                } )
            } ).catch( err => {
                process.exit( 1 )
                return 0;
            } )
        } ).catch( err => {
            console.error( "cant find settings.json" )
            process.exit( 1 )
            return 0
        } )
    }
if ( !module.parent ) {
    run()

}
module.exports = run
