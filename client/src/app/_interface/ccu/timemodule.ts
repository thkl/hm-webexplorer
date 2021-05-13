/*
 * **************************************************************
 * File: timemodule.ts
 * Project: hm-webexplorer-client
 * File Created: Saturday, 17th April 2021 1:09:02 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:39:54 am
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
export interface CCUTimeModule {

    id: number;
    sunOffsetType: number;
    calDuration: number;
    time: string;
    timeSeconds: number;
    calRepeatTime: string;
    calRepetitionCount: number;

    period: number;
    calRepetitionValue: number;
    weekdays: number;
    timerType: number;
    begin: string;
    end: string;
    endSeconds: number;

    timeMode: number;

    rangeMode?: number;
    rangeStartTime?: string;
    rangeEndTime?: string;

    sunRiseShift?: string;
    sunRiseDuration?: string;

    sunSetShift?: string;
    sunSetDuration?: string;

    /* Helper */

    beginTime?: string;

    weekDayNames: string[];
    monthNames: string[];
    countNames: string[];

    currentPeriodPattern?: string;

    periodPatternTimeUnits?: string[];
    currentPeriodPatternTimeUnitIndex: number;
    currentPeriodPatternTimeUnit?: string;
    currentPeriodPatternTime?: number;

    dailyRepMode: number;
    patternDay?: string;

    weeklyRepMode: number;
    weeklyDays: boolean[];

    currentMontlyPatternIndex?: number;
    currentMontlyPattern?: string;

    currentMontlyDayIndex?: number;
    currentMontlyDay?: string;

    montlyRepMode: number;

    yearlyRepMode: number;

    currentYearlyMonthIndex: number;
    currentYearlyMonth: string;
    currentYearlyDay: number;

    currentYearlyMonthDayIndex: number;
    currentYearlyMonthDay: string;

    currentYearlyMonthDayCountIndex: number;
    currentYearlyMonthDayCountName: string;

    validityBeginDate?: string;

    validityEndMode: number;
    validityEndDate?: string;
}