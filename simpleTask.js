const logToCtl = require( './logToCtl' ),
    notifier = require( './notifications' ),
    loadJson = require( 'load-json-file' ),
    findRel = require( './shared' ).findRel


module.exports = ( key, obj = {}, another = {} ) => {
    return Promise.all( [ 'messages.json', 'settings.json' ].map( json => findRel( json ) ).map( a => a.then( b => loadJson( b ) ) ) ).then( all => {
        const [ message, settings ] = all

        return notifier( Object.assign( {
            timeout: 5,
            icon: settings.icon
        }, message[ key ], another ), Object.assign( { defaultAction: () => {}, 'undefined': () => {} }, obj ) )
    } ).catch( a => { console.error( a ) } )
}
module.exports.run = which => logToCtl( which )
