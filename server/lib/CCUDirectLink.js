/*
 * **************************************************************
 * File: CCUDirectLink.js
 * Project: hm-webexplorer-server
 * File Created: Saturday, 20th March 2021 12:47:35 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:32:25 am
 * Modified By: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Copyright 2020 - 2021 @thkl / github.com/thkl
 * -----
 * **************************************************************
 * MIT License
 * 
 * Copyright (c) 2021 github.com/thkl
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * **************************************************************
 */

const path = require('path')
const fs = require('fs')

module.exports = class CCUDirectLink {
    constructor(name, description, flags) {
        this.NAME = name
        this.DESCRIPTION = description
        this.FLAGS = flags
    }

    setSender(sender, paramset) {
        this.SENDER = sender
        this.SENDER_PARAMSET = paramset
    }

    setReceiver(receiver, paramset) {
        this.RECEIVER = receiver
        this.RECEIVER_PARAMSET = paramset
    }



    isParamsetActivated(setToTest, currentActiveSet) {
        let result = true
        Object.keys(currentActiveSet).forEach(parameterKey => {
            if (parameterKey !== 'UI_HINT') {
                let parameter = setToTest[parameterKey]
                if ((parameter) && (parameter.readonly === true)) {
                    if (String(parameter.val) !== String(currentActiveSet[parameterKey])) {
                        //console.log('Key %s did not match (%s vs %s)', parameterKey, parameter.val, currentActiveSet[parameterKey])
                        result = false
                    }
                }
            }
        })
        return result
    }

    getEasyModeSet(sender, receiver) {
        let file = path.join(__dirname, '..', 'easymodes', receiver, sender + '.json')
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file))
        } else {
            return {}
        }
    }


    getEasyModeSets(coordinator) {
        let self = this
        let oCSender = coordinator.regaManager.channelbyAddress(this.SENDER)
        let oCRecv = coordinator.regaManager.channelbyAddress(this.RECEIVER)
        if ((oCSender) && (oCRecv)) {
            let emSets = self.getEasyModeSet(oCSender.type, oCRecv.type)

            if (emSets) {
                this.easyModeSets = emSets
            }
            if (this.RECEIVER_PARAMSET) {
                if ((this.RECEIVER_PARAMSET.UI_HINT !== undefined) && (this.RECEIVER_PARAMSET.UI_HINT !== "")) {
                    this.currentEasyModeSet = this.RECEIVER_PARAMSET.UI_HINT
                } else {
                    // there is no UI_HINT Parameter set so we will try to figure out which set is active
                    Object.keys(emSets).forEach(setKey => {
                        let emSet = emSets[setKey]
                        if (self.isParamsetActivated(emSet.params, self.RECEIVER_PARAMSET) === true) {
                            // check if there was not previous set selected .. 0 will match (Expert Mode)
                            if ((self.currentEasyModeSet === undefined) || (self.currentEasyModeSet === '0')) {
                                self.currentEasyModeSet = setKey
                            }
                        }
                    })
                }
            }
        }
    }

}