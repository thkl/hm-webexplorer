import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { CCUDatapoint } from 'src/app/_interface/ccu/datapoint';
import { CCUProgramRuleCondition } from 'src/app/_interface/ccu/program';
import { CCUTimeModule } from 'src/app/_interface/ccu/timemodule';
import { CCUVariable } from 'src/app/_interface/ccu/variable';
import { CCUConstants } from 'src/app/_provider/constants';
import { DataService } from 'src/app/_service/data.service';

@Component({
    template: ''
})


export class MasterComponent implements OnInit {

    @Input() condition: CCUProgramRuleCondition;
    @Input() conditionId: number;

    public conditionTypeText: string;
    public conditionTypeText2: string;
    public apihost: string;

    constructor(
        public dataService: DataService
    ) {
        this.apihost = this.dataService.networkService.apiHost;
    }

    generateConditionText(): void {
        switch (this.condition.conditionType) {
            case 6: // rcRangeFromRangeLessThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblRangeFrom', 'REGA');
                this.conditionTypeText2 = this.dataService.localizationService.parameterLocalization('ruleConditionLblRangeLessThan',
                    'REGA');
                break;
            case 8: // rcGreaterThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblGreaterThan', 'REGA');

                break;
            case 9: // rcGreaterOrEqualThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblGreaterOrEqualThan', 'REGA');
                break;
            case 10: // rcLessThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblLessThan', 'REGA');
                break;
            case 11: // rcLessOrEqualThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblLessOrEqualThan', 'REGA');
                break;
            case 1: // rcEqualThan
                this.conditionTypeText = this.dataService.localizationService.parameterLocalization('ruleConditionLblEqualThan', 'REGA');
                break;
            default:
                this.conditionTypeText = '';
                this.conditionTypeText2 = '';
        }
    }

    ngOnInit(): void {
        this.generateConditionText();
    }

    selectLeftValType(newType: number): void {
        if (newType !== this.condition.leftValType) {
            this.condition.leftValType = newType;
            this.condition.leftValObject = null;
            this.condition.rightVal1 = 0;
            this.condition.rightVal2 = 0;
            this.condition.conditionType = 0;
            this.conditionTypeText = '';
            this.conditionTypeText2 = '';
        }
    }

    setConditionType(newConditionType: number): void {
        this.condition.conditionType = newConditionType;
        this.generateConditionText();
    }

    setConditionType2(newConditionType: number): void {
        this.condition.conditionType2 = newConditionType;
        this.generateConditionText();
    }


    selectOperatorType(newType: number): void {
        this.condition.operatorType = newType;
    }
}


@Component({
    selector: 'app-condition-variable',
    templateUrl: './uicomponent_con_variable.html'
})

export class VariableConditionComponent extends MasterComponent implements OnInit {

    public variable: CCUVariable;

    public varList: CCUVariable[];

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    selectNewVariable(newVariable: CCUVariable): void {
        this.condition.leftValObject = newVariable;
        this.condition.conditionChannel = CCUConstants.ID_ERROR;
        this.condition.leftVal = String(newVariable.id);
        this.conditionTypeText = 'Select a condition';
    }

    public filterList(event: any): void {
        const fltr = event.target.value;
        this.varList = this.dataService.variableProvider.variableList.filter((variable => {
            return variable.name.toLowerCase().indexOf(fltr.toLowerCase()) > -1;
        }));
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.varList = this.dataService.variableProvider.variableList;
    }

}


@Component({
    selector: 'app-condition-channel',
    templateUrl: './uicomponent_con_channel.html'
})

export class ChannelConditionComponent extends MasterComponent implements OnInit {

    public device: CCUChannel;
    public dpSelectorOptions: any[];
    public selectedDpOption: any;
    public showVirtual = false;
    public cnFilter: string;


    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    setChannel(channel: CCUChannel): void {
        console.log(channel);
        this.dpSelectorOptions = [];
        this.condition.leftVal = String(CCUConstants.ID_ERROR);
        this.condition.leftValLabel = channel.name;
        this.condition.conditionChannel = channel.id;
        this.condition.conditionType = CCUConstants.rcEqualThan;
        this.condition.conditionType2 = CCUConstants.rcTriggerWhenChanged;
        channel.datapoints.forEach(datapoint => {

            const rslt = this.dataService.programProvider.ruleTextsForDatapoint(datapoint);
            this.dpSelectorOptions = this.dpSelectorOptions.concat(rslt);

            if (datapoint.defaultDP === true) {

                this.selectedDpOption = rslt[0];
                this.condition.leftVal = String(datapoint.id);
                this.condition.leftValObject = datapoint;

                if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype === CCUConstants.istAction)) {
                    this.condition.conditionType2 = 1; // Do not show 'onchage' etc
                }

                if (this.selectedDpOption) {
                    this.condition.rightVal1 = this.selectedDpOption.vl;
                    this.condition.rightVal1ValType = this.selectedDpOption.vt;
                    this.condition.rightVal2 = this.selectedDpOption.vl2;
                    this.condition.rightVal2ValType = this.selectedDpOption.vt2;
                }
                console.log(this.selectedDpOption);
            }
        });

        //
    }

    getConditionValueKey(datapoint: CCUDatapoint): string {
        if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype !== CCUConstants.istAction)) {
            return (this.condition.rightVal1) ? String(this.condition.rightVal1).toUpperCase() : '';
        }

        if ((datapoint.valuetype === CCUConstants.ivtInteger) && (datapoint.valuesubtype === CCUConstants.istEnum)) {

        }

        return String(this.condition.leftVal);
    }

    generateConditionText(): void {
        super.generateConditionText();
        const datapoint = this.condition.leftValObject;
        if (datapoint) {
            const opts = this.dataService.programProvider.ruleTextsForDatapoint(datapoint);
            const cval = this.getConditionValueKey(datapoint);
            opts.forEach(optn => {
                if (String(optn.cp) === cval) {
                    this.selectedDpOption = optn;
                }
            });
            const cid = datapoint.parentChannel;
            const channel = this.dataService.deviceProvider.channelWithId(cid);
            this.dpSelectorOptions = [];
            channel.datapoints.forEach(cdatapoint => {
                const rslt = this.dataService.programProvider.ruleTextsForDatapoint(cdatapoint);
                this.dpSelectorOptions = this.dpSelectorOptions.concat(rslt);
            });
        }
    }

    setOption(newOption: any): void {
        console.log(newOption);
        // set the new Datapoint and set the new Object
        this.condition.leftVal = String(newOption.lv);
        this.condition.rightVal1 = newOption.vl;
        this.condition.rightVal1ValType = newOption.vt;
        this.condition.rightVal2 = newOption.vl2;
        this.condition.rightVal2ValType = newOption.vt2;
        const datapoint = this.dataService.deviceProvider.datapointWithId(parseInt(this.condition.leftVal, 10));

        this.condition.leftValObject = datapoint;
        if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype === CCUConstants.istAction)) {
            this.condition.conditionType2 = 1; // Do not show 'onchage' etc
        }


        this.generateConditionText();
    }

    setNegateCondition(doNegate: boolean): void {
        this.condition.negateCondition = doNegate;
        this.condition.negateConditionText = (doNegate) ? 'ruleConditionLblNot' : 'ruleConditionLblWhen';
    }

}



@Component({
    selector: 'app-condition-selectobject',
    templateUrl: './uicomponent_selObject.html'
})

export class SelectConditionObjectComponent extends MasterComponent implements OnInit {
    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    ngOnInit(): void {
        super.ngOnInit();
    }
}


@Component({
    selector: 'app-condition-trigger',
    templateUrl: './uicomponent_trigger.html'
})

export class ConditionTriggerComponent extends MasterComponent implements OnInit {
    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    ngOnInit(): void {
        super.ngOnInit();
    }
}


@Component({
    selector: 'app-operator-type',
    templateUrl: './uicomponent_operatortype.html'
})

export class ConditionOperatorTypeComponent extends MasterComponent implements OnInit {
    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    ngOnInit(): void {
        super.ngOnInit();
    }
}


@Component({
    selector: 'app-condition-timer',
    templateUrl: './uicomponent_con_timemodule.html',
    styleUrls: ['./uicomponent_con_timemodule.sass']
})

export class ConditionTimerComponent extends MasterComponent implements OnInit {
    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    public timeModule: CCUTimeModule;

    public rangeMode: number;

    ngOnInit(): void {
        super.ngOnInit();
        const moduleId = this.condition.rightVal1;

        if ((moduleId) && (moduleId > 0)) {
            this.dataService.programProvider.getTimeModule(moduleId).then((mdl) => {
                this.timeModule = mdl;
                console.log('Module:');
                console.log(this.timeModule);


            });
        }
    }

    setPattern(newPattern: number): void {
        this.timeModule.timerType = newPattern;
        this.dataService.programProvider.parseTimerIntervalType(this.timeModule);
    }

    setPeriodicPatternTimeUnitIndex(newPattern: number): void {
        this.timeModule.currentPeriodPatternTimeUnitIndex = newPattern;
        this.timeModule.currentPeriodPattern = this.timeModule.periodPatternTimeUnits[this.timeModule.currentPeriodPatternTimeUnitIndex];
    }


    setMontlyPattern(newPattern: number): void {
        this.timeModule.currentMontlyPatternIndex = newPattern;
        this.timeModule.currentMontlyPattern = this.timeModule.countNames[this.timeModule.currentMontlyPatternIndex];
    }

    setMontlyDay(newDay: number): void {
        this.timeModule.currentMontlyDayIndex = newDay;
        this.timeModule.currentMontlyDay = this.timeModule.weekDayNames[this.timeModule.currentMontlyDayIndex];
    }

    setYearlyDayCountIndex(newIndex: number): void {
        this.timeModule.currentYearlyMonthDayCountIndex = newIndex;
        this.timeModule.currentYearlyMonthDayCountName = this.timeModule.countNames[this.timeModule.currentYearlyMonthDayCountIndex];
    }

    setYearlyDay(newDay: number): void {
        console.log(newDay);
        this.timeModule.currentYearlyMonthDayIndex = newDay;
        this.timeModule.currentYearlyMonthDay = this.timeModule.weekDayNames[this.timeModule.currentYearlyMonthDayIndex];
        console.log(this.timeModule);
    }

    setMonth(newMonth: number): void {
        this.timeModule.currentYearlyMonthIndex = newMonth;
        this.timeModule.currentYearlyMonth = this.timeModule.monthNames[this.timeModule.currentYearlyMonthIndex];
    }


    saveTimer(): void {
        this.dataService.programProvider.updateTimer(this.timeModule);
    }
}
