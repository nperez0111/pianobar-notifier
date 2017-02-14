const exec = ( proc, args ) => {
        var cp = require( 'child_process' );
        var child = cp.spawn( proc, args, { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
        child.unref();
    },
    run = () => {
        exec( 'pianobar', [] )
    }
if ( !module.parent ) {
    run()
}
module.exports = run
