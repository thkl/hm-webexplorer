import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';


@Component({
    template: ''
})

export class MasterComponent implements OnInit {

    @Input() option: any;
    @Input() optioncat: string;
    @Input() senderType: string;
    @Input() paramset: any;
    @Input() value: any;

    public paramsetValue: any;
    private $linkOptions: any[];


    constructor(
        private dataService: DataService
    ) {

    }

    ngOnInit(): void {

        this.paramsetValue = this.paramset[this.option.param];
    }


    userValue(value: string): string {
        return value;
    }

    linkOptions(key: string, currentValue?: string): any {
        if (currentValue === undefined) {
            currentValue = this.paramsetValue;
        }
        const cv = String(currentValue);
        this.$linkOptions = this.dataService.deviceProvider.getLinkOptions(key, this.optioncat);
        // check if our current value is part of the option list .. if not
        let keyList = Object.keys(this.$linkOptions);
        if (keyList.indexOf(cv) === -1) {
            // add the option
            this.$linkOptions[cv] = {
                value: this.userValue(cv)
            };
            // build a new keylist
            keyList = Object.keys(this.$linkOptions);
        }
        return keyList;
    }

    linkOptionValues(key: string, value: string): any {
        const loV = this.$linkOptions[value];
        return loV;
    }

    public saveParameter(): void {

    }
}


@Component({
    selector: 'app-entertime-hms',
    templateUrl: './uicomponents/uicomponents_entertime.html'
})

export class EnterTimeHMSComponent extends MasterComponent implements OnInit {

    public emsHour: string;
    public emsMinute: string;
    public emsSecond: string;
    public timeOptions: any[];

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    ngOnInit(): void {
        super.ngOnInit();
        this.timeOptions = this.linkOptions(this.option.option, this.paramset[this.option.param]);
        this.emsHour = '00';
        this.emsMinute = '00';
        this.emsSecond = '00';
    }

    toHHMMSS(input: string): string {
        const secNum = parseFloat(input); // don't forget the second param
        const hours = Math.floor(secNum / 3600);
        const minutes = Math.floor((secNum - (hours * 3600)) / 60);
        const seconds = secNum - (hours * 3600) - (minutes * 60);

        let result = ' ';
        if (hours > 0) {
            result = result = String(hours) + ' h ';
        }

        result = result + String(minutes) + ' m ';
        result = result + String(seconds) + ' s';
        return result;
    }

    userValue(value: string): string {
        // these are seconds so parse it and calculate h m s
        return this.toHHMMSS(value);
    }

    public saveParameter(): void {
        const result = parseInt(this.emsHour, 10) * 3600 + parseInt(this.emsMinute, 10) * 60 + parseInt(this.emsSecond, 10);
        if (!isNaN(result)) {
            this.paramset[this.option.param] = result;
        }
    }

}

@Component({
    selector: 'app-enterpercent',
    templateUrl: './uicomponents/uicomponents_enterpercent.html'
})

export class EnterPercentComponent extends MasterComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;


    ngOnInit(): void {
        this.paramsetValue = this.paramset[this.option.param] * 100; // we are in percent
    }

    public saveParameter(): void {
        this.paramset[this.option.param] = this.paramsetValue / 100;
    }
}

@Component({
    selector: 'app-subset',
    templateUrl: './uicomponents/uicomponents_subset.html'
})

export class SubsetComponent extends MasterComponent implements OnInit {

    @ContentChild(TemplateRef) itemWrapper: TemplateRef<any>;

    ngOnInit(): void {
        super.ngOnInit();
        // loop thru all subsets .. check values against this.paramset
        let setFound = -1;
        this.option.subsets.forEach(set => {
            let allMatch = true;
            const idKey = 'SUBSET_OPTION_VALUE';
            Object.keys(set).forEach(setKey => {
                // NAME and SUBSET_OPTION_VALUE are not part of the paramset so we do not check them
                if ((setKey !== 'NAME') && (setKey !== idKey) && (set[setKey] !== this.paramset[setKey])) {
                    allMatch = false;
                }
            });
            if (allMatch === true) {
                setFound = set[idKey];
            }
        });
        if (setFound !== -1) {
            this.paramsetValue = setFound;
        }
    }

}
