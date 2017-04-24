const exec = ( proc, args = [] ) => {
        var cp = require( 'child_process' );
        var child = cp.spawn( proc, args, { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();
    },
    isOn = require( './isPianobarOn' ),
    run = () => {
        isOn().then( () => {
            const pianobar = require( './playPause' )
            pianobar.play()
        } ).catch( () => { exec( 'pianobar' ) } )
    }
if ( !module.parent ) {
    run()
}
module.exports = run
