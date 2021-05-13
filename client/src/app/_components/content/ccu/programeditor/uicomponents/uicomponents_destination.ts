import { Component, OnInit, ContentChild, TemplateRef, Input } from '@angular/core';
import { CCUChannel } from 'src/app/_interface/ccu/channel';
import { CCUDatapoint } from 'src/app/_interface/ccu/datapoint';
import { CCURuleDestination } from 'src/app/_interface/ccu/program';
import { CCUVariable } from 'src/app/_interface/ccu/variable';
import { CCUConstants } from 'src/app/_provider/constants';
import { DataService } from 'src/app/_service/data.service';

@Component({
    template: ''
})

export class MasterDestinationComponent implements OnInit {

    @Input() destination: CCURuleDestination;
    @Input() destinationId: number;

    public apihost: string;

    constructor(
        public dataService: DataService
    ) {
        this.apihost = this.dataService.networkService.apiHost;
    }

    generateDestinationText(): void {

    }

    ngOnInit(): void {

    }


}

@Component({
    selector: 'app-destination-delayobject',
    templateUrl: './uicomponent_dest_delay.html'
})

export class DestinationDelayComponent extends MasterDestinationComponent implements OnInit {
    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;



    ngOnInit(): void {
        super.ngOnInit();
        console.log('Init new DelayComponent ...');
        this.calculateDelay();
    }

    calculateDelay(): void {
        if (this.destination.destinationValueParamType === CCUConstants.ivtDelay) {
            this.destination.activeDelay = true;
            this.destination.timingText = 'ruleActivitySelectDelayed';
            const dt = new Date(this.destination.destinationValueParam);
            let seconds = dt.getSeconds();
            let minutes = dt.getMinutes();
            let hours = dt.getHours();
            let delayTime = 0;
            if (seconds > 0) { delayTime = seconds + (minutes * 60) + (hours * 3600); minutes = 0; hours = 0; }
            if (minutes > 0) { delayTime = minutes + (hours * 60); hours = 0; }
            if (hours > 0) { delayTime = hours; }

            if (seconds > 0) {
                this.destination.delayUnit = 'ruleActivitySelectSeconds';
                this.destination.delayTime = delayTime;
            }
            if (minutes > 0) {
                this.destination.delayUnit = 'ruleActivitySelectMinutes';
                this.destination.delayTime = delayTime;
            }
            if (hours > 0) {
                this.destination.delayUnit = 'ruleActivitySelectHours';
                this.destination.delayTime = delayTime;
            }
            this.destination.destinationValueParam = `'${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}:${String(dt.getSeconds()).padStart(2, '0')}'`

        } else {
            console.log('there is no delay');
            this.destination.timingText = 'ruleActivitySelectImmediately';
            this.destination.delayTime = 0;
            this.destination.delayUnit = 'ruleActivitySelectSeconds';
            this.destination.activeDelay = false;
        }
    }

    setDelayUnit(newUnit: string) {
        this.destination.delayUnit = newUnit;
        this.calculateValParam();
    }


    calculateValParam() {
        let date = new Date('2000-01-01T00:00:00');
        switch (this.destination.delayUnit) {
            case 'ruleActivitySelectSeconds':
                date.setSeconds(this.destination.delayTime);
                break;
            case 'ruleActivitySelectMinutes':
                date.setMinutes(this.destination.delayTime);
                break;
            case 'ruleActivitySelectHours':
                date.setHours(this.destination.delayTime);
                break;
        }
        console.log(date)
        this.destination.destinationValueParam = `'${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}'`
    }


    updateDelayActive() {
        console.log('updateDelayActive')
        if (this.destination.activeDelay) {
            this.destination.timingText = 'ruleActivitySelectDelayed';
            this.destination.destinationValueParamType = CCUConstants.ivtDelay;
        } else {
            this.destination.timingText = 'ruleActivitySelectImmediately';
            this.destination.destinationValueParamType = CCUConstants.ivtEmpty;
        }
    }

}



@Component({
    selector: 'app-destination-selectobject',
    templateUrl: './uicomponent_dest_selObject.html'
})

export class DestinationSelectObjectComponent extends MasterDestinationComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    ngOnInit(): void {
        super.ngOnInit();
        console.log(this.destination);
    }

    selectDestinationParam(newDestParam: number): void {
        this.destination.destinationParam = newDestParam;
    }

}

@Component({
    selector: 'app-destination-channel',
    templateUrl: './uicomponent_dest_channel.html'
})

export class DestinationChannelComponent extends MasterDestinationComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    public dpSelectorOptions: any[];
    public selectedDpOption: any;
    public cnFilter: string;
    public txValue = false;
    public destinationValue: any;

    ngOnInit(): void {
        super.ngOnInit();
        this.generateDestinationText();
    }


    getDestinationValueKey(datapoint: CCUDatapoint): string {
        if ((datapoint.valuetype === CCUConstants.ivtBinary) && (datapoint.valuesubtype !== CCUConstants.istAction)) {
            return this.destination.destinationValue.toLocaleUpperCase();
        }

        if ((datapoint.valuetype === CCUConstants.ivtInteger) && (datapoint.valuesubtype === CCUConstants.istEnum)) {

        }

        return String(this.destination.destinationValue);
    }

    generateDestinationText(): void {
        super.generateDestinationText();
        const dpID = this.destination.destinationDP;
        const datapoint = this.dataService.deviceProvider.datapointWithId(dpID);
        if (datapoint) {

            const opts = this.dataService.programProvider.destinationTextsForDatapoint(datapoint);
            const cval = this.getDestinationValueKey(datapoint);
            if (opts.length === 1) {
                this.selectedDpOption = opts[0];
            } else {
                opts.forEach(optn => {
                    if (String(optn.vl).toLocaleUpperCase() === cval.toUpperCase()) {
                        this.selectedDpOption = optn;
                    }
                });

                if (this.selectedDpOption === undefined) {
                    this.selectedDpOption = opts[0]; // if we are note able to find the matching one use 
                    // the first (this will be the case on new rules)
                }
            }

            const cid = datapoint.parentChannel;
            const channel = this.dataService.deviceProvider.channelWithId(cid);
            this.destination.destinationLabel = channel.name;
            this.dpSelectorOptions = [];
            channel.datapoints.forEach(cDatapoint => {
                if (cDatapoint.operations && CCUConstants.OPERATION_WRITE) {
                    const rslt = this.dataService.programProvider.destinationTextsForDatapoint(cDatapoint);
                    this.dpSelectorOptions = this.dpSelectorOptions.concat(rslt);
                }
            });

            const dpvt = datapoint.valuetype;
            if (dpvt === CCUConstants.ivtFloat) {
                this.txValue = true;
            } else {
                this.txValue = false;
            }

            this.destinationValue = this.destination.destinationValue;
            if (datapoint.factor > 1) {
                this.destinationValue = parseFloat(this.destination.destinationValue) * datapoint.factor;
            }

        } else {
            console.log('no datapoint');
            this.destination.destinationLabel = 'Select a device';
        }
    }

    setOption(option: any): void {
        this.destination.destinationDP = option.lv;
        this.destination.destinationValue = option.vl;
        this.generateDestinationText();
    }


    setChannel(channel: CCUChannel): void {
        console.log(channel);
        this.dpSelectorOptions = [];
        this.destination.destinationChannel = channel.id;
        channel.datapoints.forEach(datapoint => {
            if (datapoint.defaultDP === true) {
                console.log(datapoint);
                this.destination.destinationDP = datapoint.id;
            }
        });
        // if we dont have a default use the first one
        if (this.destination.destinationDP === undefined) {
            const fk = Object.keys(channel.datapoints)[0];
            this.destination.destinationDP = channel.datapoints[fk].id;
        }
        console.log(this.destination.destinationDP);
        this.generateDestinationText();
        // set the default value
        this.destination.destinationValue = this.selectedDpOption.vl;
        console.log(this.destination);
    }

    destinationValueChange(): void {
        const dpID = this.destination.destinationDP;
        const datapoint = this.dataService.deviceProvider.datapointWithId(dpID);
        if (datapoint) {
            if (datapoint.factor > 1) {
                this.destination.destinationValue = String(parseFloat(this.destinationValue) / datapoint.factor);
            } else {
                this.destination.destinationValue = this.destinationValue;
            }
        }
    }
}


@Component({
    selector: 'app-destination-variable',
    templateUrl: './uicomponent_dest_variable.html'
})

export class DestinationVariableComponent extends MasterDestinationComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    public variableValue: string;
    public variableunit: string;
    public varList: CCUVariable[];
    public variable: CCUVariable;

    buildUserFriendlyValue(): void {
        if (this.variable) {
            this.destination.destinationLabel = this.variable.name;
            this.variableunit = this.variable.unit;
            if ((this.variable.valuetype === CCUConstants.ivtBinary) &&
                ((this.variable.subtype === CCUConstants.istBool) || (this.variable.subtype === CCUConstants.istAlarm))) {
                if (this.destination.destinationValue === 'false') {
                    this.variableValue = this.variable.valueName0;
                } else {
                    this.variableValue = this.variable.valueName1;
                }
            } else if ((this.variable.valuetype === CCUConstants.ivtInteger) && (this.variable.subtype === CCUConstants.istEnum)) {
                const vv = this.variable.valuelist.split(';');
                const dv = parseInt(this.destination.destinationValue, 10);
                if (vv.length > dv) {
                    this.variableValue = vv[dv];
                }
            }
            else {
                this.variableValue = this.destination.destinationValue;
            }

        } else {
            this.variableValue = '';
            this.variableunit = '';
            this.destination.destinationLabel = 'Select a variable';
        }
    }

    variableValues(): any {
        if ((this.variable.valuetype === CCUConstants.ivtBinary) &&
            ((this.variable.subtype === CCUConstants.istBool) || (this.variable.subtype === CCUConstants.istAlarm))) {
            return [{ vl: 'false', label: this.variable.valueName0 }, { vl: 'true', label: this.variable.valueName1 }];
        }
        if ((this.variable.valuetype === CCUConstants.ivtInteger) && (this.variable.subtype === CCUConstants.istEnum)) {
            let zl = 0;
            const result = [];

            this.variable.valuelist.split(';').forEach(v => {
                result.push({ vl: zl, label: v });
                zl = zl + 1;
            });

            return result;
        }
        return undefined;
    }

    setNewValue(newValue: string): void {
        console.log(newValue);
        this.destination.destinationValue = newValue;
        this.buildUserFriendlyValue();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.variable = this.dataService.variableProvider.variableById(this.destination.destinationDP);
        this.buildUserFriendlyValue();
        this.varList = this.dataService.variableProvider.variableList;
    }

    setNewVariable(newVarId: number): void {
        this.destination.destinationDP = newVarId;
        this.variable = this.dataService.variableProvider.variableById(this.destination.destinationDP);
        this.destination.destinationValue = String(this.variable.maxvalue);
        this.buildUserFriendlyValue();
        this.dataService.uiProvider.addRecentlyUsedObject('variable', this.variable);
    }

    recentlyUsed(): CCUVariable[] {
        let lst = this.dataService.uiProvider.recentlyUsed('variable');
        if (lst === undefined) {
            lst = [];
        }
        return lst;
    }
}


@Component({
    selector: 'app-destination-script',
    templateUrl: './uicomponent_dest_script.html'
})

export class DestinationScriptComponent extends MasterDestinationComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;
    public isCollapsed: boolean;

    ngOnInit(): void {
        super.ngOnInit();
        if (this.destination.destinationValue) {
            this.destination.destinationLabel = unescape(this.destination.destinationValue).substr(0, 100) + '...';
        } else {
            this.destination.destinationLabel = ' ... ';
        }
    }

    script(): string {
        return unescape(this.destination.destinationValue);
    }

    toggleScript(): void {
        this.isCollapsed = !this.isCollapsed;
    }
}

