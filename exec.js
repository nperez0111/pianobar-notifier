#!/usr/bin/node

var cp = require( 'child_process' );
var child = cp.spawn( 'node', [ '.' ], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] } );
child.unref();
