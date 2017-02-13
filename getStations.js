module.exports = obj => {
    const stations = ( new Array( parseInt( obj.stationCount, 10 ) ) ).fill( null ).map( ( c, i ) => "station" + i ).map( key => obj[ key ] )

    stations.forEach( ( c, i ) => {
        //Fixes a bug where stations may not always split correctly 
        if ( c === undefined ) {
            const split = stations[ i - 1 ].split( ",station" + i + ":" )
            stations[ i - 1 ] = split[ 0 ];
            stations[ i ] = split[ 1 ]
        }
    } )

    return stations
}
