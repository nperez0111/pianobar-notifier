#!/usr/bin/env node

const loadJsonFile = require( 'load-json-file' ),
    writeJSON = require( 'write-json-file' ),
    inquirer = require( 'inquirer' ),
    shared = require( './shared' ),
    pianoDir = shared.pianoDir,
    findAbs = shared.findAbs,
    questions = [ {
        type: 'list',
        name: 'onClickDo',
        choices: [ {
            key: 't',
            name: 'Open Terminal',
            value: 'terminal'
        }, {
            key: 'u',
            name: 'Details Of the Song',
            value: 'url'
        } ],
        message: "On Click of the notification what would you like to have open?"
    }, {
        type: 'list',
        name: 'app',
        message: "What App would you like to Open?",
        choices: [ {
            key: 'i',
            name: 'iTerm 2',
            value: 'com.googlecode.iterm2'
        }, {
            key: 't',
            name: 'Terminal',
            value: 'com.apple.terminal'
        }, {
            key: 'h',
            name: 'Hyper',
            value: 'co.zeit.hyper'
        }, {
            key: 'o',
            name: 'Other',
            value: 'other'
        } ],
        when: answers => answers.onClickDo !== 'url'
    }, {
        when: answers => answers.app == 'other',
        type: 'input',
        name: 'appName',
        message: 'What app or Bundle Identifier would you like to activate on click then?'
    }, {
        when: answers => answers.app == 'other',
        type: 'list',
        name: 'appNameOrID',
        message: 'Was that the name of the app or the bundle ID?',
        choices: [ {
            name: "App Name",
            value: 'app'
        }, {
            name: "Bundle ID",
            value: 'bundle'
        } ]
    }, {
        name: 'changeIcon',
        type: 'confirm',
        default: false,
        message: 'Do you want to change the default icon on each notification?'
    }, {
        type: 'input',
        when: answers => answers.changeIcon,
        name: 'icon',
        message: 'Enter the full path of the icon.'
    }, {
        type: 'confirm',
        default: false,
        message: 'Do you want to change the default fifo Location?',
        name: 'changeFifo'
    }, {
        when: answers => answers.changeFifo,
        name: 'ctlLoc',
        type: 'input',
        message: 'Input the full path to the Fifo file.'
    }, {
        type: 'input',
        message: 'How long do you want your Notifications to last',
        default: 10,
        name: 'timing',
        filter: a => parseInt( a, 10 )
    } ],
    changer = ( obj, ans, change, store, els ) => {
        if ( ans[ 'change' + change ] ) {
            obj[ store ] = ans[ store ]
        } else {
            obj[ store ] = els
        }
    },
    run = () => {

        inquirer.prompt( questions ).then( answers => {

            const obj = {},
                change = changer.bind( null, obj, answers )
            if ( answers.onClickDo == 'terminal' ) {
                obj.onClick = {
                    open: answers.appName || answers.app,
                    identifier: answers.appNameOrID || 'bundle'
                }
            } else {
                obj.onClick = {
                    open: 'url'
                }
            }
            change( 'Icon', 'icon', pianoDir + 'PandoraIco.png' )
            change( 'Fifo', 'ctlLoc', pianoDir + 'ctl' )

            obj.timing = answers.timing

            console.log( JSON.stringify( obj, ( a, b ) => b, 2 ) )

            inquirer.prompt( [ {
                type: 'confirm',
                default: true,
                name: 'look',
                message: "Does this look about right?"
            } ] ).then( answer => {
                if ( answer.look ) {
                    findAbs( 'settings.json' ).then( file => writeJSON( file, obj ) ).then( () => {
                        console.log( "Success!" )
                    } ).catch( a => { console.log( "Writing file failed...", a ) } )
                } else {
                    console.log( "Well... load it up again!" )
                }
            } )
        } )
    }
if ( !module.parent ) {
    run()
}
module.exports = run
