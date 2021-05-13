/*
 * **************************************************************
 * File: program.ts
 * Project: hm-webexplorer-client
 * File Created: Monday, 22nd March 2021 5:30:56 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:41:33 am
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
export interface CCUProgramRuleCondition {
    cid: number;
    leftVal: string;
    operatorType: number; // 1 &  2 ||

    leftValType: number; //    ivtObjectId = 18 (Datapoint), ivtSystemId = 19 (Variable) ,   ivtCurrentDate = 24 (TimeModule)
    leftValObject?: any;
    leftValLabel?: string;

    rightVal1: any;
    rightVal1ValType: number; // ivtBinary - 2    ivtFloat - 4    ivtInteger - 16    ivtString - 20
    rightVal2: any;
    rightVal2ValType: number;

    conditionType: number;  //   rcRangeFromRangeLessThan=6,    rcGreaterThan=8,
    // rcGreaterOrEqualThan=9,    rcLessThan=10,    rcLessOrEqualThan=11,    rcEqualThan=1,

    conditionType2: number;  //   rcCheckOnly=15,    rcTriggerWhenUpdated=13,    rcTriggerWhenChanged=4,
    conditionChannel: number;
    ruleDescription: string;
    negateCondition: boolean;
    negateConditionText: string;
    lastCondition: boolean;
}

export interface CCUProgramConditionSet {
    ruleCndOperatorType: number; // 1 &  2 ||
    condition: CCUProgramRuleCondition[];
    lastConditionSet: boolean;
}

export interface CCUProgramRuleset {
    lastRuleset: boolean;
    conditions?: { [key: number]: CCUProgramConditionSet };
    destinations?: { [key: number]: CCURuleDestination };
    ruleBreakOnRestart?: boolean;
    emptyDestinations: boolean;
}

export interface CCURuleDestination {
    destinationId: number;
    destinationDP: number;
    destinationChannel: number;
    destinationParam: number;
    destinationValue: string;
    destinationValueParam: string;
    destinationValueParamType: number;
    destinationValueType: number;
    destinationLabel: string;


    timingText?: string;
    delayTime?: number;
    delayUnit?: string;
    activeDelay?: boolean;
}

export interface CCUProgram {
    id: number;
    name: string;
    programInfo: string;
    active: boolean;
    internal: boolean;
    rulesets?: { [key: number]: CCUProgramRuleset };
    rulesDescription?: string;
}


