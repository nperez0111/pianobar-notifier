#!/usr/bin/node

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
    likeSong = require( './likeSong' ),
    dislikeSong = require( './dislikeSong' ),
    quit = require( './quitPianobar' )

//get the stdin to parse all the info out
loadJsonFile( 'settings.json' ).then( json => {

    loadJsonFile( '/Users/nickthesick/.config/pianobar/cur.json' ).then( prefs => {


        ( ( { albumArt, song, album, radio, artist, icon, url, timing } ) => ( new Promise( function ( resolve, error ) {
            imageDownloader( {
                url: albumArt,
                dest: ( process.cwd() +
                    '/albumArt.jpg' ),
                done: function ( err, filename, image ) {
                    if ( err ) {
                        error( err )
                    }
                    resolve( filename )
                }
            } )
        } ) ).then( filename => {

            notifier( {
                title: song,
                subtitle: artist,
                message: `On:${album}, ${radio}`,
                icon: icon,
                contentImage: filename,
                closeLabel: "Quit",
                timeout: timing,
                actions: [ 'Next Song', 'Like Song', 'Dislike Song', 'Select Station' ]
            }, {
                timeout: function () {
                    console.log( 'timed out' )
                },
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
                                defaultAction: () => {
                                    //nothing needed
                                }
                            }, camelCase( val ) )

                        }
                    }, type.activationType, type.activationValue )
                }
            } )

        } ).catch( err => { console.err( err ) } ) )( {
            albumArt: prefs.coverArt,
            url: prefs.detailUrl,
            artist: prefs.artist,
            song: prefs.title,
            album: prefs.album,
            radio: prefs.songStationName || prefs.stationName,
            icon: json.icon,
            timing: json.timing
        } )
    } )
} )
