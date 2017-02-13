const loadJsonFile = require( 'load-json-file' ),
    writeJSON = require( 'write-json-file' ),
    inquirer = require( 'inquirer' ),
    homedir = require( 'homedir' ),
    dir = homedir(),
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
            name: 'HyperTerm',
            value: 'co.zeit.hyperterm'
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
            change( 'Icon', 'icon', dir + '/.config/pianobar/PandoraIco.png' )
            change( 'Fifo', 'ctlLoc', dir + '/.config/pianobar/ctl' )

            console.log( JSON.stringify( obj, ( a, b ) => b, 2 ) )
            inquirer.prompt( [ { type: 'confirm', default: true, name: 'look', message: "Does this look about right?" } ] ).then( answer => {
                if ( answer.look ) {
                    writeJSON( 'settings.json', obj ).then( () => {
                        console.log( "Success." )
                    } ).catch( a => { console.log( "Something happened...", a ) } )
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
