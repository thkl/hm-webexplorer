class dummyjQuery {

    constructor() {
        this.messages = {}
        this.lng = 'de'
    }

    setLang(lng) {
        this.lng = lng
        this.messages[lng] = {}
    }

    extend(bla, blub, msg) {
        let lng = msg[this.lng]
        Object.keys(lng).forEach(msg => {
            this.messages[this.lng][msg] = lng[msg]
        })
    }
}
const fs = require('fs')
const jQuery = new dummyjQuery()
const langJSON = { de: { dialogNewDevicesHmIPWithoutInternet: '' } }
const HMIdentifier = { de: { CCUShortName: 'ccu' } };

jQuery.setLang('de')

let st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.extension.js').toString()
eval(st)

st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.channelDescription.js').toString()
eval(st)

st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.deviceDescription.js').toString()
eval(st)

st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.group.js').toString()
eval(st)

st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.js').toString()
eval(st)

st = fs.readFileSync('/Users/thomaskluge/Dokumente_alt/ccu/www/webui/js/lang/de/translate.lang.stringtable.js').toString()
eval(st)


fs.writeFileSync('../locale/de.json', JSON.stringify(jQuery.messages.de, ' ', 2))