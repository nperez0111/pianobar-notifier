const logToCtl = require( './logToCtl' ),
    notifier = require( './notifications' ),
    loadJson = require( 'load-json-file' ),
    findAbs = require( './shared' ).findAbs


module.exports = ( key, obj = {}, another = {} ) => {
    return Promise.all( [ 'messages.json', 'settings.json' ].map( json => findAbs( json ) ).map( path => path.then( file => loadJson( file ) ) ) ).then( all => {
        const [ message, settings ] = all

        return notifier( Object.assign( {
            timeout: 5,
            icon: settings.icon
        }, message[ key ], another ), Object.assign( { defaultAction: () => {}, 'undefined': () => {} }, obj ) )
    } ).catch( a => { console.error( a ) } )
}
module.exports.run = which => logToCtl( which )
