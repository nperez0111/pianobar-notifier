const logToCtl = require( './logToCtl' ),
    notifier = require( './notifications' ),
    loadJson = require( 'load-json-file' )


module.exports = ( key, obj = {}, another = {} ) => {
    return Promise.all( [ loadJson( 'messages.json' ), loadJson( 'settings.json' ) ] ).then( all => {
        const [ message, settings ] = all

        return notifier( Object.assign( {
            wait: false,
            icon: settings.icon
        }, message[ key ], another ), Object.assign( { defaultAction: () => {}, 'undefined': () => {} }, obj ) )
    } ).catch( a => { console.error( a ) } )
}
module.exports.run = which => logToCtl( which )
