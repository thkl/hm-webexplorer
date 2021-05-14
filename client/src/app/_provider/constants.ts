/*
 * **************************************************************
 * File: constants.ts
 * Project: hm-webexplorer-client
 * File Created: Sunday, 28th March 2021 11:09:00 am
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:39:14 am
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
 * 
 * 
 */
export class CCUConstants {
    public static get ivtEmpty(): number { return 0; }
    public static get ivtNull(): number { return 1; }
    public static get ivtBinary(): number { return 2; }
    public static get ivtFloat(): number { return 4; }
    public static get ivtRelScaling(): number { return 5; }
    public static get ivtScaling(): number { return 6; }
    public static get ivtBitMask(): number { return 7; }
    public static get ivtByte(): number { return 8; }
    public static get ivtWord(): number { return 9; }
    public static get ivtDate(): number { return 10; }
    public static get ivtTime(): number { return 11; }
    public static get ivtDateTime(): number { return 12; }
    public static get ivtInteger(): number { return 16; }
    public static get ivtDWord(): number { return 17; }
    public static get ivtObjectId(): number { return 18; }
    public static get ivtSystemId(): number { return 19; }
    public static get ivtString(): number { return 20; }
    public static get ivtSceneNumber(): number { return 21; }
    public static get ivtCurrentValue(): number { return 22; }
    public static get ivtCurrentDateTime(): number { return 23; }
    public static get ivtCurrentDate(): number { return 24; }
    public static get ivtCurrentTime(): number { return 25; }
    public static get ivtSunrise(): number { return 26; }
    public static get ivtSunset(): number { return 27; }
    public static get ivtDelay(): number { return 28; }
    public static get ivtCalMonthly(): number { return 29; }
    public static get ivtCalYearly(): number { return 30; }
    public static get ivtCalOnce(): number { return 31; }
    public static get ivtCalDaily(): number { return 32; }
    public static get ivtCalWeekly(): number { return 33; }
    public static get ivtSpecialValue(): number { return 39; }


    public static strValueType(valuetype: number): string {
        switch (valuetype) {
            case 0:
                return "ivtEmpty";
            case 1:
                return "ivtNull";
            case 2:
                return "ivtBinary";
            case 4:
                return "ivtFloat";
            case 5:
                return "ivtRelScaling";
            case 6:
                return "ivtScaling";
            case 7:
                return "ivtBitMask";
            case 8:
                return "ivtByte";
            case 9:
                return "ivtWord";
            case 10:
                return "ivtDate";
            case 11:
                return "ivtTime";
            case 12:
                return "ivtDateTime";
            case 16:
                return "ivtInteger";
            case 17:
                return "ivtDWord";
            case 18:
                return "ivtObjectId";
            case 19:
                return "ivtSystemId";
            case 20:
                return "ivtString";
            case 21:
                return "ivtSceneNumber";
            case 22:
                return "ivtCurrentValue";
            case 23:
                return "ivtCurrentDateTime";
            case 24:
                return "ivtCurrentDate";
            case 25:
                return "ivtCurrentTime";
            case 26:
                return "ivtSunrise";
            case 27:
                return "ivtSunset";
            case 28:
                return "ivtDelay";
            case 29:
                return "ivtCalMonthly";
            case 30:
                return "ivtCalYearly";
            case 31:
                return "ivtCalOnce";
            case 32:
                return "ivtCalDaily";
            case 33:
                return "ivtCalWeekly";
            case 39:
                return "ivtSpecialValue";
            default:
                return "unknown";
        }
    }

    public static get istGeneric(): number { return 0; }
    public static get istSwitch(): number { return 1; }
    public static get istBool(): number { return 2; }
    public static get istEnable(): number { return 3; }
    public static get istStep(): number { return 4; }
    public static get istUpDown(): number { return 5; }
    public static get istAlarm(): number { return 6; }
    public static get istOpenClose(): number { return 7; }
    public static get istState(): number { return 8; }
    public static get istByteCounter(): number { return 9; }
    public static get istCharAscii(): number { return 10; }
    public static get istChar8859(): number { return 11; }

    public static get istWordCounter(): number { return 12; }
    public static get istDWordCounter(): number { return 13; }
    public static get istTemperature(): number { return 14; }
    public static get istVelocity(): number { return 15; }
    public static get istLux(): number { return 16; }
    public static get istDegree(): number { return 17; }
    public static get istValueS(): number { return 18; }
    public static get istValueU(): number { return 19; }
    public static get istSMS(): number { return 20; }
    public static get istEMail(): number { return 21; }
    public static get istStopStart(): number { return 22; }
    public static get istPresent(): number { return 23; }
    public static get istByteUCounter(): number { return 24; }
    public static get istIntUCounter(): number { return 25; }
    public static get istPercent(): number { return 26; }
    public static get istHumidity(): number { return 27; }
    public static get istAction(): number { return 28; }
    public static get istEnum(): number { return 29; }





    public static strValueSubType(valuesubtype: number): string {
        switch (valuesubtype) {
            case 0:
                return "istGeneric";
            case 1:
                return "istSwitch";
            case 2:
                return "istBool";
            case 3:
                return "istEnable";
            case 4:
                return "istStep";
            case 5:
                return "istUpDown";
            case 6:
                return "istAlarm";
            case 7:
                return "istOpenClose";
            case 8:
                return "istState";
            case 9:
                return "istByteCounter";
            case 10:
                return "istCharAscii";
            case 11:
                return "istChar8859";
            case 12:
                return "istWordCounter";
            case 13:
                return "istDWordCounter";
            case 14:
                return "istTemperature";
            case 15:
                return "istVelocity";
            case 16:
                return "istLux";
            case 17:
                return "istDegree";
            case 18:
                return "istValueS";
            case 19:
                return "istValueU";
            case 20:
                return "istSMS";
            case 21:
                return "istEMail";
            case 22:
                return "istStopStart";
            case 23:
                return "istPresent";
            case 24:
                return "istByteUCounter";
            case 25:
                return "istIntUCounter";
            case 26:
                return "istPercent";
            case 27:
                return "istHumidity";
            case 28:
                return "istAction";
            case 29:
                return "istEnum";
            default:
                return "unknown";
        }
    }
    public static get OPERATION_NONE(): number { return 0; }
    public static get OPERATION_READ(): number { return 1; }
    public static get OPERATION_WRITE(): number { return 2; }
    public static get OPERATION_EVENT(): number { return 4; }
    public static get OPERATION_ALL(): number { return 7; }

    public static strOperations(op: number): string {
        let result = [];

        if (op & CCUConstants.OPERATION_NONE) {
            result.push('NONE');
        }

        if (op & CCUConstants.OPERATION_READ) {
            result.push('READ');
        }

        if (op & CCUConstants.OPERATION_WRITE) {
            result.push('WRITE');
        }

        if (op & CCUConstants.OPERATION_EVENT) {
            result.push('EVENT');
        }

        return result.join(' | ');
    }

    public static get rcRangeFromRangeLessThan(): number { return 6; }
    public static get rcGreaterThan(): number { return 8; }
    public static get rcGreaterOrEqualThan(): number { return 9; }
    public static get rcLessThan(): number { return 10; }
    public static get rcLessOrEqualThan(): number { return 11; }
    public static get rcEqualThan(): number { return 1; }

    public static get rcTriggerWhenUpdated(): number { return 13; }
    public static get rcCheckOnly(): number { return 15; }
    public static get rcTriggerWhenChanged(): number { return 4; }

    public static get OT_NONE(): number { return 0; }
    public static get OT_OBJECT(): number { return 1; }
    public static get OT_ENUM(): number { return 3; }
    public static get OT_ROOT(): number { return 5; }
    public static get OT_DOM(): number { return 9; }
    public static get OT_DEVICE(): number { return 17; }
    public static get OT_DEVICES(): number { return 19; }
    public static get OT_CHANNEL(): number { return 33; }
    public static get OT_CHANNELS(): number { return 35; }
    public static get OT_DP(): number { return 65; }
    public static get OT_DPS(): number { return 67; }
    public static get OT_TIMERDP(): number { return 321; }
    public static get OT_CALENDARDP(): number { return 1048897; }
    public static get OT_MAPDP(): number { return 577; }
    public static get OT_VARDP(): number { return 1089; }
    public static get OT_ALARMDP(): number { return 2113; }
    public static get OT_COMMDP(): number { return 4161; }
    public static get OT_IPDP(): number { return 8257; }
    public static get OT_UPNPDP(): number { return 65601; }
    public static get OT_KNXDP(): number { return 131137; }
    public static get OT_OCEANDP(): number { return 196673; }
    public static get OT_USER(): number { return 129; }
    public static get OT_USERS(): number { return 131; }
    public static get OT_RFDP(): number { return 262209; }
    public static get OT_IRDP(): number { return 327745; }
    public static get OT_HSSDP(): number { return 393281; }
    public static get OT_SCHEDULER(): number { return 655360; }
    public static get OT_USERPAGE(): number { return 720899; }
    public static get OT_INTERFACE(): number { return 458753; }
    public static get OT_PROGRAM(): number { return 786433; }
    public static get OT_HISTORYDP(): number { return 524353; }
    public static get OT_SMTPSRV(): number { return 589825; }
    public static get OT_POPCLIENT(): number { return 2097153; }
    public static get OT_CONDITION(): number { return 4194305; }
    public static get OT_MESSAGE(): number { return 7340033; }
    public static get OT_UIDATA(): number { return 8388609; }
    public static get OT_FAVORITE(): number { return 10485763; }
    public static get OT_ALL(): number { return -1; }

    public static get ID_DOM(): number { return 1; }
    public static get ID_ROOT(): number { return 2; }
    public static get ID_DEVICES(): number { return 3; }
    public static get ID_CHANNELS(): number { return 4; }
    public static get ID_DATAPOINTS(): number { return 5; }
    public static get ID_STRUCTURE(): number { return 6; }
    public static get ID_VALUE_EVENTING(): number { return 10; }
    public static get ID_EVENTING(): number { return 11; }
    public static get ID_RUNTIMECONFIG(): number { return 21; }
    public static get ID_ROOMS(): number { return 101; }
    public static get ID_FUNCTIONS(): number { return 151; }
    public static get ID_FAVORITES(): number { return 201; }
    public static get ID_LINKS(): number { return 301; }
    public static get ID_SCENES(): number { return 401; }
    public static get ID_CIRCUITS(): number { return 501; }
    public static get ID_CONTACTS(): number { return 601; }
    public static get ID_ALARMS(): number { return 701; }
    public static get ID_ALARM_MAPS(): number { return 700; }
    public static get ID_UPNP(): number { return 750; }
    public static get ID_ENOCEAN(): number { return 850; }
    public static get ID_PRESENT(): number { return 950; }
    public static get ID_USERS(): number { return 7; }
    public static get ID_USERPAGES(): number { return 8; }
    public static get ID_INTERFACES(): number { return 9; }
    public static get ID_GW_DEVICE(): number { return 12; }
    public static get ID_GW_CHANNEL(): number { return 13; }
    public static get ID_GW_DATAPOINT(): number { return 14; }
    public static get ID_PROGRAMS(): number { return 15; }
    public static get ID_HISTORYDPS(): number { return 16; }
    public static get ID_PRESENCE_SIMULATION(): number { return 19; }
    public static get ID_VIEW_OBJECTS(): number { return 30; }
    public static get ID_MESSAGES(): number { return 31; }
    public static get ID_UI_DATAS(): number { return 32; }
    public static get ID_SYSTEM_VARIABLES(): number { return 27; }
    public static get ID_SERVICES(): number { return 28; }
    public static get ID_RULES(): number { return 33; }
    public static get ID_CALENDARDPS(): number { return 34; }
    public static get ID_ERROR(): number { return 65535; }



    public static strDirection(dir: number): string {
        switch (dir) {
            case 0:
                return 'lblChannelNotLinkable'
            case 1:
                return 'lblSender'
            case 2:
                return 'lblReceiver'
            default:
                return 'unknown'
        }
    }


    public static strAES(aes: boolean): string {
        return aes ? 'lblSecured' : 'lblStandard';
    }


    public static get ttCalOnce(): number { return 8; }
    public static get ttPeriodic(): number { return 4; }
    public static get ttCalDaily(): number { return 9; }
    public static get ttCalWeekly(): number { return 5; }
    public static get ttCalMonthly(): number { return 6; }
    public static get ttCalYearly(): number { return 7; }

    public static get sotNone(): number { return 0; }
    public static get sotSunrise(): number { return 1; }
    public static get sotBeforeSunrise(): number { return 2; }
    public static get sotAfterSunrise(): number { return 3; }
    public static get sotSunset(): number { return 4; }
    public static get sotBeforeSunset(): number { return 5; }
    public static get sotAfterSunset(): number { return 6; }


    public static get asOncoming(): number { return 1; }


}