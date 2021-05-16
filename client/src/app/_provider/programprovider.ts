/*
 * **************************************************************
 * File: programprovider.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 22nd March 2021 5:30:32 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:56 am
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
import { BehaviorSubject, Observable } from 'rxjs';
import { CCUChannel } from '../_interface/ccu/channel';
import { CCUDatapoint } from '../_interface/ccu/datapoint';
import { CCUProgram, CCUProgramRuleset } from '../_interface/ccu/program';
import { CCUTimeModule } from '../_interface/ccu/timemodule';
import { DataService } from '../_service/data.service';
import { NetworkService } from '../_service/network.service';
import { CCUConstants } from './constants';
import * as moment from 'moment';


export class ProgramProvider {

    private $programList: CCUProgram[] = new Array<CCUProgram>();
    private $programList$: BehaviorSubject<CCUProgram[]>;
    private networkService: NetworkService;
    private $ruleTexts: any;
    private _settings: any;


    constructor(
        private dataService: DataService
    ) {
        this.$programList$ = new BehaviorSubject(new Array<CCUProgram>());
        this.networkService = dataService.networkService;
        this.udpateProgramList();
        this.updateRuleTexts();
        this._settings = {};

    }

    settings(key: string, defaultVal: any): any {
        return this._settings[key] || defaultVal;
    }

    storeSettings(key: string, value: any): void {
        this._settings[key] = value;
    }

    updateRuleTexts(): void {
        this.networkService.getJsonData('config/ruleTexts')
            .then(result => {
                console.log('ALL Data: ', result);
                this.$ruleTexts = result;
            });
    }

    udpateProgramList(): Promise<any> {
        return new Promise(resolve => {
            this.networkService.getJsonData('program')
                .then(result => {
                    console.log('ALL Data: ', result);
                    const key = 'programs';
                    this.$programList = [];
                    result[key].forEach(prg => {
                        if (prg.copyId === CCUConstants.ID_ERROR) { // only add non copys
                            this.$programList.push(prg);
                        }
                    });
                    this.$programList$.next(this.$programList);
                    resolve(null);
                })
                .catch(error => {
                    console.log('Error Getting Data: ', error);
                });
        })
    }

    programById(programId: number): CCUProgram {
        const rslt = this.$programList.filter(program => {
            return (program.id === programId);
        });
        return (rslt.length > 0) ? rslt[0] : undefined;
    }

    replaceProgram(newProgram: CCUProgram): void {
        this.$programList = this.$programList.filter(program => {
            return (program.id !== newProgram.id);
        });
        this.$programList.push(newProgram);
    }

    get programList(): CCUProgram[] {
        return this.$programList;
    }

    getProgramDetails(programId: number): Promise<CCUProgram> {
        return new Promise(async (resolve) => {
            console.log('Loading details for program %s', programId)
            let oPrg = this.programById(programId);
            if (oPrg) {
                if (oPrg.rulesets === undefined) {
                    let p = await this.networkService.getJsonData(`program/${programId}`);
                    if (p) {
                        console.log('setting up details');
                        oPrg = p as CCUProgram;
                        this.replaceProgram(oPrg);
                    }
                }
                // mark the last rule
                let lastId = Object.keys(oPrg.rulesets).length - 1;
                oPrg.rulesets[lastId].lastRuleset = true;
                console.log('Last Rule is %s', lastId);
                resolve(oPrg);
            }
        });
    }

    parseProgram(dataservice: DataService, programId: number): void {
        console.log('Parsing program %s', programId);
        const oPrg = this.programById(programId);

        oPrg.rulesDescription = '';
        if (oPrg.rulesets) {
            Object.keys(oPrg.rulesets).forEach(rulesetID => {
                const ruleset = oPrg.rulesets[rulesetID];
                Object.keys(ruleset.conditions).forEach(conditionSetId => {
                    const conditionSet = ruleset.conditions[conditionSetId];
                    conditionSet.condition.forEach(condition => {
                        let ruleDescription = this.dataService.localizationService.parameterLocalization('ruleConditionIf', 'REGA');
                        switch (condition.leftValType) {
                            case CCUConstants.ivtObjectId:
                                ruleDescription = ruleDescription + ' Channel ';
                                const did = parseInt(condition.leftVal, 10);
                                const datapoint = dataservice.deviceProvider.datapointWithId(did);
                                if (datapoint) {
                                    condition.leftValObject = datapoint;
                                    const cid = datapoint.parentChannel;
                                    const channel = dataservice.deviceProvider.channelWithId(cid);
                                    condition.leftValLabel = channel.name;
                                    ruleDescription = ruleDescription + channel.name;
                                    ruleDescription = ruleDescription + ' ';
                                } else {
                                    console.log('%s datapoint with id %s not found', programId, did);
                                    condition.leftValLabel = 'Invalid Datapoint';
                                }
                                break;
                            case CCUConstants.ivtSystemId:
                                ruleDescription = ruleDescription + ' Variable ';
                                const vid = parseInt(condition.leftVal, 10);
                                const variable = dataservice.variableProvider.variableById(vid);
                                condition.leftValObject = variable;
                                condition.leftValLabel = variable.name;
                                ruleDescription = ruleDescription + variable.name;
                                ruleDescription = ruleDescription + ' ';
                                break;

                            case CCUConstants.ivtCurrentDate:
                                ruleDescription = ruleDescription + ' Timer ';
                                condition.leftValLabel = condition.leftVal;
                                break;
                        }

                        switch (condition.conditionType) {
                            case CCUConstants.rcRangeFromRangeLessThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblRangeFrom', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblRangeLessThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal2;
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcGreaterThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblGreaterThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcGreaterOrEqualThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblGreaterOrEqualThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcLessThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblLessThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcLessOrEqualThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblLessOrEqualThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcEqualThan:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionLblEqualThan', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                ruleDescription = ruleDescription + condition.rightVal1;
                                ruleDescription = ruleDescription + ' ';
                                break;
                        }

                        switch (condition.conditionType2) {
                            case CCUConstants.rcCheckOnly:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionSelectCheckOnly', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcTriggerWhenUpdated:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionSelectTriggerWhenUpdated', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case CCUConstants.rcTriggerWhenChanged:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleConditionSelectWhenChanged', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                break;
                        }

                        switch (condition.operatorType) {
                            case 1:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleSelectAND', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                break;
                            case 2:
                                ruleDescription = ruleDescription + this.dataService.localizationService.parameterLocalization('ruleSelectOR', 'REGA');
                                ruleDescription = ruleDescription + ' ';
                                break;
                        }

                        switch (condition.negateCondition) {
                            case true:
                                condition.negateConditionText = 'ruleConditionLblNot';
                                break;
                            case false:
                                condition.negateConditionText = 'ruleConditionLblWhen';
                        }

                        condition.ruleDescription = ruleDescription;
                        oPrg.rulesDescription = oPrg.rulesDescription + ruleDescription;
                    });
                });

                ruleset.destinations.forEach(destination => {

                    switch (destination.destinationParam) {
                        case 18:
                            const datapoint = this.dataService.deviceProvider.datapointWithId(destination.destinationDP);
                            if (datapoint !== undefined) {
                                const cid = datapoint.parentChannel;
                                const channel = dataservice.deviceProvider.channelWithId(cid);
                                destination.destinationLabel = channel.name;
                            } else {
                                destination.destinationLabel = 'Invalid device';
                            }
                            break;
                    }

                })

            });
        } else {
            console.log('No ruleset found in', oPrg);
        }
    }

    destinationTextsForDatapoint(datapoint: CCUDatapoint): any[] {
        const result: any[] = [];
        const cid = datapoint.parentChannel;
        const channel = this.dataService.deviceProvider.channelWithId(cid);
        console.log('dtfd %s -> type %s sub %s', datapoint.name, datapoint.valuetype, datapoint.valuesubtype)
        if ((datapoint.valuetype === CCUConstants.ivtInteger) && (datapoint.valuesubtype === CCUConstants.istEnum)) {
            datapoint.valuelist.forEach(sVLValue => {
                const sLongKey = `${channel.label}|${datapoint.hssid}=${sVLValue}`;
                const sShortKey = `${datapoint.hssid}=${sVLValue}`;
                if (this.$ruleTexts[sLongKey]) {
                    result.push({ tx: this.$ruleTexts[sLongKey], lv: datapoint.id, vl: sVLValue, cp: sVLValue });
                } else if (this.$ruleTexts[sShortKey]) {
                    result.push({ tx: this.$ruleTexts[sShortKey], lv: datapoint.id, vl: sVLValue, cp: sVLValue });
                }
            });


        } else
            if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype !== CCUConstants.istAction)) {

                ['TRUE', 'FALSE'].forEach(state => {
                    const sLongKey = `${channel.label}|${datapoint.hssid}=${state}`;
                    const sShortKey = `${datapoint.hssid}=${state}`;

                    if (this.$ruleTexts[sLongKey]) {
                        result.push({ lv: datapoint.id, vl: state, tx: this.$ruleTexts[sLongKey], cp: state });
                    } else if (this.$ruleTexts[sShortKey]) {
                        result.push({ lv: datapoint.id, vl: state, tx: this.$ruleTexts[sShortKey], cp: state });
                    }
                });


            } else {

                const sLongKey = `${channel.label}|${datapoint.hssid}`;
                const sShortKey = `${datapoint.hssid}`;

                if (this.$ruleTexts[sLongKey]) {
                    result.push({
                        lv: datapoint.id, tx: this.$ruleTexts[sLongKey], vl: datapoint.min,
                        cp: datapoint.id, ap: datapoint.unit
                    });
                } else if (this.$ruleTexts[sShortKey]) {
                    result.push({
                        lv: datapoint.id, tx: this.$ruleTexts[sShortKey], vl: datapoint.min,
                        cp: datapoint.id, ap: datapoint.unit
                    });
                }
            }

        return result;
    }

    ruleTextsForDatapoint(datapoint: CCUDatapoint): any[] {
        const result: any[] = [];
        const cid = datapoint.parentChannel;
        const channel = this.dataService.deviceProvider.channelWithId(cid);
        console.log('rtfd %s sub %s', datapoint.valuetype, datapoint.valuesubtype)
        if ((datapoint.valuetype === CCUConstants.ivtInteger) && (datapoint.valuesubtype === CCUConstants.istEnum)) {
            datapoint.valuelist.forEach(sVLValue => {
                const sLongKey = `${channel.label}|${datapoint.hssid}=${sVLValue}`;
                const sShortKey = `${datapoint.hssid}=${sVLValue}`;
                if (this.$ruleTexts[sLongKey]) {
                    result.push({
                        tx: this.$ruleTexts[sLongKey], lv: datapoint.id, vl: sVLValue,
                        cp: sVLValue, vt: CCUConstants.ivtInteger
                    });
                } else if (this.$ruleTexts[sShortKey]) {
                    result.push({
                        tx: this.$ruleTexts[sShortKey], lv: datapoint.id, vl: sVLValue,
                        cp: sVLValue, vt: CCUConstants.ivtInteger
                    });
                }
            });


        } else
            if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype !== CCUConstants.istAction)) {

                ['TRUE', 'FALSE'].forEach(state => {
                    const sLongKey = `${channel.label}|${datapoint.hssid}=${state}`;
                    const sShortKey = `${datapoint.hssid}=${state}`;

                    if (this.$ruleTexts[sLongKey]) {
                        result.push({
                            lv: datapoint.id,
                            vl: (state === 'TRUE'),
                            tx: this.$ruleTexts[sLongKey],
                            cp: state,
                            vt: CCUConstants.ivtBinary,
                            vl2: (state !== 'TRUE'),
                            vt2: CCUConstants.ivtBinary
                        });
                    } else if (this.$ruleTexts[sShortKey]) {
                        result.push({
                            lv: datapoint.id,
                            vl: (state === 'TRUE'),
                            tx: this.$ruleTexts[sShortKey],
                            cp: state,
                            vt: CCUConstants.ivtBinary,
                            vl2: (state !== 'TRUE'),
                            vt2: CCUConstants.ivtBinary
                        });
                    }
                });


            } else {

                const sLongKey = `${channel.label}|${datapoint.hssid}`;
                const sShortKey = `${datapoint.hssid}`;

                if (this.$ruleTexts[sLongKey]) {
                    result.push({
                        lv: datapoint.id, tx: this.$ruleTexts[sLongKey], vl: 'true',
                        cp: datapoint.id, vt: CCUConstants.ivtBinary
                    });
                } else if (this.$ruleTexts[sShortKey]) {
                    result.push({
                        lv: datapoint.id, tx: this.$ruleTexts[sShortKey], vl: 'true',
                        cp: datapoint.id, vt: CCUConstants.ivtBinary
                    });
                }
            }

        // console.log(result);
        return result;
    }

    subscribeToProgramList(): Observable<CCUProgram[]> {
        return this.$programList$.asObservable();
    }

    compressArray(inpArray: any): any {
        const result = {};
        Object.keys(inpArray).forEach(key => {
            if (key) {
                result[key] = inpArray[key];
            }
        });
        return result;
    }

    cleanProgram(inputProg: CCUProgram): CCUProgram {
        let program = JSON.parse(JSON.stringify(inputProg));
        // remove LastRun ,rulesDescription and the firstRuleID
        delete program['lastRun'];
        delete program['firstRuleId'];
        delete program['rulesDescription'];
        // loop thru rulesets
        Object.keys(program.rulesets).forEach(rsid => {
            let ruleset = program.rulesets[rsid];
            if (ruleset.conditions) {
                Object.keys(ruleset.conditions).forEach(csid => {
                    let conditionSet = ruleset.conditions[csid];
                    conditionSet.condition.forEach(condition => {
                        delete condition['leftValObject'];
                        delete condition['leftValLabel'];
                        delete condition['negateConditionText'];
                        delete condition['ruleDescription'];
                        delete condition['lastCondition'];
                    });
                    delete conditionSet['lastConditionSet'];
                })
            }
            if (ruleset.destinations) {
                Object.keys(ruleset.destinations).forEach(dstId => {
                    let destination = ruleset.destinations[dstId];
                    delete destination['activeDelay'];
                    delete destination['destinationLabel'];
                    delete destination['timingText'];
                    delete destination['delayTime'];
                    delete destination['delayUnit'];
                    delete destination['activeDelay'];
                })
            }
            delete ruleset['emptyDestinations'];
            delete ruleset['lastRuleset'];
        })
        return program;
    }

    saveProgram(program: CCUProgram): void {
        if (program.id != CCUConstants.ID_ERROR) {
            console.log('updating existing program')
            // replace the stored one
            let prg = this.programById(program.id)
            prg = program
            this.networkService.putJsonData(`program/${program.id}`, this.cleanProgram(program)).then(result => {
                if ((result) && (result['id'])) {
                    this.udpateProgramList().then(() => {
                        this.getProgramDetails(result['id']);
                    });
                }
            })
        } else {
            // send it to the ccu
            console.log('adding a new program')
            this.networkService.putJsonData(`program`, this.cleanProgram(program)).then(result => {
                if ((result) && (result['id'])) {
                    this.udpateProgramList().then(() => {
                        this.getProgramDetails(result['id']);
                    });
                }
            })
        }
    }

    deleteProgram(program: CCUProgram): void {
        this.networkService.deleteRequest('program/' + program.id).then(() => {
            this.udpateProgramList();
        });
    }


    getTimeModule(moduleId: number): Promise<CCUTimeModule> {
        return new Promise(resolve => {
            this.networkService.getJsonData('timer/' + moduleId).then(result => {
                const tm = result as CCUTimeModule;
                resolve(this.parseTimeModule(tm));
            });
        });
    }

    convertDomTime(inp: string): string {
        const m = moment(inp);
        if (m.isValid()) {
            return m.format('HH:mm');
        } else {
            return '';
        }
    }

    convertDomDate(inp: string): string {
        const m = moment(inp);
        if (m.isValid()) {
            return m.format('DD.MM.YYYY');
        } else {
            return '';
        }
    }

    calcEndTime(inp: string, duration: number): string {
        const m = moment(inp);
        if (m.isValid()) {
            m.add(duration, 's');
            return m.format('HH:mm');
        } else {
            return '';
        }
    }

    parseTimeModule(tm: CCUTimeModule): CCUTimeModule {

        tm.rangeStartTime = this.convertDomTime(tm.time);
        tm.beginTime = this.convertDomTime(tm.time);
        tm.rangeEndTime = this.calcEndTime(tm.time, tm.calDuration);
        tm.sunRiseShift = '';
        tm.sunRiseDuration = '';
        tm.sunSetShift = '';
        tm.sunSetDuration = '';

        tm.timeMode = 0;
        tm.rangeMode = 1;

        tm.weeklyDays = [false, false, false, false, false, false, false]; // Set all Weekdays off

        tm.weekDayNames = ['timeModuleLblSelSerialPatternMonday',
            'timeModuleLblSelSerialPatternTuesday',
            'timeModuleLblSelSerialPatternWednesday',
            'timeModuleLblSelSerialPatternThursday',
            'timeModuleLblSelSerialPatternFriday',
            'timeModuleLblSelSerialPatternSaturday',
            'timeModuleLblSelSerialPatternSunday'];

        tm.monthNames = ['timeModuleSelectSerialPatternJan',
            'timeModuleSelectSerialPatternFeb',
            'timeModuleSelectSerialPatternMar',
            'timeModuleSelectSerialPatternApr',
            'timeModuleSelectSerialPatternMay',
            'timeModuleSelectSerialPatternJun',
            'timeModuleSelectSerialPatternJul',
            'timeModuleSelectSerialPatternAug',
            'timeModuleSelectSerialPatternSep',
            'timeModuleSelectSerialPatternOct',
            'timeModuleSelectSerialPatternNov',
            'timeModuleSelectSerialPatternDec'
        ];


        tm.countNames = ['timeModuleSelectSerialPatternFirst',
            'timeModuleSelectSerialPatternSecond',
            'timeModuleSelectSerialPatternThird',
            'timeModuleSelectSerialPatternFourth',
            'timeModuleSelectSerialPatternFifth'];

        switch (tm.sunOffsetType) {
            case CCUConstants.sotNone:
                console.log('sotNone');
                if ((tm.calDuration === 0) && (tm.timeSeconds === 0)) {
                    tm.rangeMode = 2;
                    tm.timeMode = 1;
                } else
                    if (tm.calDuration !== 0) {
                        tm.rangeMode = 1;
                        tm.timeMode = 1;
                    } else {
                        tm.timeMode = 0;
                    }
                break;
            case CCUConstants.sotSunrise:


                break;
            case CCUConstants.sotBeforeSunrise:
                break;
            case CCUConstants.sotAfterSunrise:
                tm.rangeMode = 3;
                tm.timeMode = 1;
                tm.sunRiseShift = String(tm.timeSeconds / 60);
                tm.sunRiseDuration = String(tm.calDuration / 60);
                break;
            case CCUConstants.sotSunset:
                break;
            case CCUConstants.sotBeforeSunset:
                break;
            case CCUConstants.sotAfterSunset:
                tm.rangeMode = 6;
                tm.timeMode = 1;
                tm.sunSetShift = String(tm.timeSeconds / 60);
                tm.sunSetDuration = String(tm.calDuration / 60);
                break;
        }

        tm.periodPatternTimeUnits = ['timeModuleSelectSerialPatternSeconds', 'timeModuleSelectSerialPatternMinutes', 'timeModuleSelectSerialPatternHours']

        this.parseTimerIntervalType(tm);
        this.parseTimerValidity(tm);
        this.parseWeeklyDayPattern(tm);
        this.parseMontlyPattern(tm);
        this.parseYearlyPattern(tm);
        return tm;
    }

    parseTimerValidity(tm: CCUTimeModule): void {
        tm.validityBeginDate = this.convertDomDate(tm.begin);


        if ((tm.calRepetitionCount === 0) && (tm.endSeconds === 0)) {
            tm.validityEndMode = 0;
        } else if (tm.calRepetitionCount === 0) {
            tm.validityEndMode = 2;
            tm.validityEndDate = this.convertDomDate(tm.end);
        } else {
            tm.validityEndMode = 1;
        }
    }

    parseWeeklyDayPattern(tm: CCUTimeModule): void {

        if (tm.calRepetitionValue === 0) {
            tm.weeklyRepMode = 0;
        } else {
            tm.weeklyRepMode = 1;
        }

        // tslint:disable: no-bitwise
        tm.weeklyDays[0] = ((tm.weekdays & 1) !== 0);
        tm.weeklyDays[1] = ((tm.weekdays & 2) !== 0);
        tm.weeklyDays[2] = ((tm.weekdays & 4) !== 0);
        tm.weeklyDays[3] = ((tm.weekdays & 8) !== 0);
        tm.weeklyDays[4] = ((tm.weekdays & 16) !== 0);
        tm.weeklyDays[5] = ((tm.weekdays & 32) !== 0);
        tm.weeklyDays[6] = ((tm.weekdays & 64) !== 0);
        // tslint:enable: no-bitwise
    }

    parseMontlyPattern(tm: CCUTimeModule): void {
        if (tm.weekdays === 0) {
            tm.montlyRepMode = 0;
        } else {
            tm.montlyRepMode = 1;
        }

        tm.currentMontlyPatternIndex = tm.period - 1;
        tm.currentMontlyPattern = tm.countNames[tm.currentMontlyPatternIndex];
        tm.currentMontlyDayIndex = 0;
        if (tm.weekdays === 2) { tm.currentMontlyDayIndex = 1; }
        if (tm.weekdays === 4) { tm.currentMontlyDayIndex = 2; }
        if (tm.weekdays === 8) { tm.currentMontlyDayIndex = 3; }
        if (tm.weekdays === 16) { tm.currentMontlyDayIndex = 4; }
        if (tm.weekdays === 32) { tm.currentMontlyDayIndex = 5; }
        if (tm.weekdays === 64) { tm.currentMontlyDayIndex = 6; }

        tm.currentMontlyDay = tm.weekDayNames[tm.currentMontlyDayIndex];
    }

    parseYearlyPattern(tm: CCUTimeModule): void {
        if (tm.weekdays === 0) {
            tm.yearlyRepMode = 0;
        } else {
            tm.yearlyRepMode = 1;
        }

        tm.currentYearlyMonthIndex = tm.period - 1;
        if (tm.currentYearlyMonthIndex < 0) {
            tm.currentYearlyMonthIndex = 0;
        }

        tm.currentYearlyMonth = tm.monthNames[tm.currentYearlyMonthIndex];
        tm.currentYearlyDay = tm.calRepetitionValue;

        tm.currentYearlyMonthDayCountIndex = tm.period - 1;
        if (tm.currentYearlyMonthDayCountIndex < 0) {
            tm.currentYearlyMonthDayCountIndex = 0;
        }

        tm.currentYearlyMonthDayCountName = tm.countNames[tm.currentYearlyMonthDayCountIndex];
        tm.currentYearlyMonthDayIndex = 0;
        if (tm.weekdays === 2) { tm.currentYearlyMonthDayIndex = 1; }
        if (tm.weekdays === 4) { tm.currentYearlyMonthDayIndex = 2; }
        if (tm.weekdays === 8) { tm.currentYearlyMonthDayIndex = 3; }
        if (tm.weekdays === 16) { tm.currentYearlyMonthDayIndex = 4; }
        if (tm.weekdays === 32) { tm.currentYearlyMonthDayIndex = 5; }
        if (tm.weekdays === 64) { tm.currentYearlyMonthDayIndex = 6; }

        tm.currentYearlyMonthDay = tm.weekDayNames[tm.currentYearlyMonthDayIndex];
    }

    parseTimerIntervalType(tm: CCUTimeModule): void {
        switch (tm.timerType) {
            case CCUConstants.ttCalOnce:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternOnce';
                tm.patternDay = this.convertDomDate(tm.calRepeatTime);
                break;
            case CCUConstants.ttPeriodic:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternTimeInterval';

                if ((tm.period / 3600) > 0) {

                    if ((tm.period % 3600) === 0) {
                        tm.currentPeriodPatternTime = tm.period / 3600;
                        tm.currentPeriodPatternTimeUnitIndex = 2;
                    } else if ((tm.period % 60) === 0) {
                        tm.currentPeriodPatternTime = tm.period / 60;
                        tm.currentPeriodPatternTimeUnitIndex = 1;
                    } else {
                        tm.currentPeriodPatternTime = tm.period;
                        tm.currentPeriodPatternTimeUnitIndex = 0;
                    }

                } else if ((tm.period / 60) > 0) {

                    if ((tm.period % 60) === 0) {
                        tm.currentPeriodPatternTime = tm.period / 60;
                        tm.currentPeriodPatternTimeUnitIndex = 1;
                    } else {
                        tm.currentPeriodPatternTime = tm.period;
                        tm.currentPeriodPatternTimeUnitIndex = 0;
                    }

                } else {
                    tm.currentPeriodPatternTime = tm.period;
                    tm.currentPeriodPatternTimeUnitIndex = 0;
                }
                tm.currentPeriodPatternTimeUnit = tm.periodPatternTimeUnits[tm.currentPeriodPatternTimeUnitIndex];
                break;
            case CCUConstants.ttCalDaily:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternDaily';
                if ((tm.calRepetitionValue === 0) && (tm.weekdays === 0)) {
                    tm.dailyRepMode = 0; // every day
                } else
                    if (tm.weekdays !== 0) {
                        if (tm.weekdays === 96) {
                            tm.dailyRepMode = 2; // on weekend
                        } else {
                            tm.dailyRepMode = 3; // on working days
                        }
                    } else {
                        tm.dailyRepMode = 1; // every x days
                    }
                break;
            case CCUConstants.ttCalWeekly:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternWeekly';
                break;
            case CCUConstants.ttCalMonthly:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternMonthly';
                break;
            case CCUConstants.ttCalYearly:
                tm.currentPeriodPattern = 'timeModuleLblSerialPatternYearly';
                break;
        }
    }

    updateTimer(tm: CCUTimeModule): void {
        // Generate the trigger time
        if (tm.timeMode === 0) {
            // Point of Time
            const mbegin = moment(`01.01.2007 ${tm.beginTime}:00`);
            tm.time = mbegin.format('YYYY-MM-DD HH:mm:SS');
            tm.timeSeconds = mbegin.unix(); // timeSeconds is the utc
            tm.sunOffsetType = CCUConstants.sotNone;
            tm.calDuration = 0;
        } else {
            // some sort of rage
            let mbegin;
            let mend;
            switch (tm.rangeMode) {
                case 1: // start and end time
                    mbegin = moment(`01.01.2007 ${tm.rangeStartTime}:00`);
                    mend = moment(`01.01.2007 ${tm.rangeEndTime}:00`);
                    tm.timeSeconds = mbegin.unix(); // timeSeconds is the utc
                    tm.sunOffsetType = CCUConstants.sotNone;
                    tm.calDuration = mend.diff(mbegin, 'seconds');
                    break;
                case 2: // whole day
                    tm.time = '1970-01-01 01:00:00';
                    tm.timeSeconds = 0;
                    tm.calDuration = 0;
                    tm.sunOffsetType = CCUConstants.sotNone;
                    break;
                case 3: // from Sunrise
                    mbegin = moment(`01.01.2007 00:00:00`);
                    mbegin.add(parseInt(tm.sunRiseShift, 10), 'minutes');
                    tm.time = mbegin.format('YYYY-MM-DD HH:mm:SS');
                    tm.timeSeconds = parseInt(tm.sunRiseShift, 10) * 60;
                    tm.calDuration = parseInt(tm.sunRiseDuration, 10);
                    tm.sunOffsetType = CCUConstants.sotSunrise;
                    break;
                case 4: // from Sunset
                    mbegin = moment(`01.01.2007 00:00:00`);
                    mbegin.add(parseInt(tm.sunRiseShift, 10), 'minutes');
                    tm.time = mbegin.format('YYYY-MM-DD HH:mm:SS');
                    tm.timeSeconds = parseInt(tm.sunRiseShift, 10) * 60;
                    tm.calDuration = parseInt(tm.sunRiseDuration, 10);
                    tm.sunOffsetType = CCUConstants.sotSunset;
                    break;
            }
        }

        // Generate the serial pattern -> the correct patten was set by the form
        let mrdate;
        switch (tm.timerType) {
            case CCUConstants.ttCalOnce:
                mrdate = moment(`${tm.patternDay} 00:00:00`);
                tm.calRepeatTime = mrdate.format('YYYY-MM-DD HH:mm:SS');
                tm.period = 0;
                tm.calRepetitionValue = 0;
                tm.weekdays = 0;
                break;
            case CCUConstants.ttPeriodic:
                tm.calRepeatTime = '1970-01-01 01:00:00';
                tm.calRepetitionValue = 0;
                tm.weekdays = 0;
                switch (tm.currentPeriodPatternTimeUnitIndex) {
                    case 0:
                        tm.period = tm.currentPeriodPatternTime;
                        break;
                    case 1:
                        tm.period = tm.currentPeriodPatternTime * 60;
                        break;
                    case 2:
                        tm.period = tm.currentPeriodPatternTime * 3600;
                        break;
                }
                break;
            case CCUConstants.ttCalDaily:
                switch (tm.dailyRepMode) {
                    case 0:
                        tm.period = 0;
                        tm.calRepeatTime = '1970-01-01 01:00:00';
                        tm.calRepetitionValue = 0;
                        tm.weekdays = 0;
                        break;
                    case 1:
                        tm.period = 0;
                        tm.calRepeatTime = '1970-01-01 01:00:00';
                        // calRepetitionValue will be set by the form
                        tm.weekdays = 0;
                        break;
                    case 2:
                        tm.period = 0;
                        tm.calRepeatTime = '1970-01-01 01:00:00';
                        tm.calRepetitionValue = 0;
                        tm.weekdays = 96;
                        break;
                    case 3:
                        tm.period = 0;
                        tm.calRepeatTime = '1970-01-01 01:00:00';
                        tm.calRepetitionValue = 0;
                        tm.weekdays = 31;
                        break;
                }
                break;
            case CCUConstants.ttCalWeekly:
                if (tm.weeklyRepMode === 0) {
                    tm.period = 0;
                    tm.calRepeatTime = '1970-01-01 01:00:00';
                    tm.calRepetitionValue = 0;
                } else {
                    tm.period = 0;
                    tm.calRepeatTime = '1970-01-01 01:00:00';
                    // calRepetitionValue will be set by the form
                }
                // build the weekdays
                let wdz = 0;
                tm.weekdays = 0;
                tm.weeklyDays.forEach(wd => {
                    if (wd === true) {
                        // tslint:disable-next-line: no-bitwise
                        tm.weekdays = tm.weekdays + (2 ^ wdz);
                    }
                    wdz = wdz + 1;
                });
                break;
            case CCUConstants.ttCalMonthly:
                if (tm.montlyRepMode === 0) {
                    tm.weekdays = 0;
                    // tm.period will be set thru the form
                    // tm.calRepetitionValue will be set thru the form
                } else {
                    tm.period = tm.currentMontlyPatternIndex + 1;
                    // tm.calRepetitionValue will be set thru the form
                    tm.weekdays = 0;
                    switch (tm.currentMontlyDayIndex) {
                        case 1:
                            tm.weekdays = 2;
                            break;
                        case 2:
                            tm.weekdays = 4;
                            break;
                        case 3:
                            tm.weekdays = 8;
                            break;
                        case 4:
                            tm.weekdays = 16;
                            break;
                        case 5:
                            tm.weekdays = 32;
                            break;
                        case 16:
                            tm.weekdays = 64;
                            break;
                    }
                }
                break;
            case CCUConstants.ttCalYearly:
                if (tm.yearlyRepMode === 0) {
                    tm.weekdays = 0;
                    // tm.period will be set thru the form
                    tm.calRepetitionValue = tm.currentYearlyMonthIndex + 1;
                } else {
                    tm.period = tm.currentYearlyMonthDayCountIndex + 1;
                    tm.weekdays = 0;
                    switch (tm.currentYearlyMonthDayIndex) {
                        case 1:
                            tm.weekdays = 2;
                            break;
                        case 2:
                            tm.weekdays = 4;
                            break;
                        case 3:
                            tm.weekdays = 8;
                            break;
                        case 4:
                            tm.weekdays = 16;
                            break;
                        case 5:
                            tm.weekdays = 32;
                            break;
                        case 16:
                            tm.weekdays = 64;
                            break;
                    }
                    tm.calRepetitionValue = tm.currentYearlyMonthIndex + 1;
                }
        }

        // generate the end pattern
        const mbegin = moment(`${tm.validityBeginDate} 00:00:00`);
        tm.begin = mbegin.format('YYYY-MM-DD HH:mm:SS');
        switch (tm.validityEndMode) {
            case 0:
                tm.calRepetitionCount = 0;
                tm.end = '1970-01-01 01:00:00';
                tm.endSeconds = 0;
                break;
            case 1:
                // tm.calRepetitionCount will be set thru the form
                tm.end = '1970-01-01 01:00:00';
                tm.endSeconds = 0;
                break;
            case 2:
                const mend = moment(`${tm.validityEndDate} 00:00:00`);
                tm.end = mend.format('YYYY-MM-DD HH:mm:SS');
                tm.endSeconds = mend.unix();
                tm.calRepetitionCount = 0;
                break;
        }

    }


    testScript(script: string): Promise<any> {
        return new Promise(resolve => {
            this.networkService.postJsonData('script/test', { script: escape(script) }).then(result => {
                resolve(result)
            })
        })
    }

    runScript(script: string): Promise<any> {
        return new Promise(resolve => {
            this.networkService.postJsonData('script', { script: escape(script) }).then(result => {
                resolve(result)
            })
        })
    }


}
