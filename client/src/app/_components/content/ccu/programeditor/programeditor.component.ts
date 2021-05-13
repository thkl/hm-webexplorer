import { Component, OnInit, Input } from '@angular/core';
import { CCUProgram } from 'src/app/_interface/ccu/program';
import { CCUConstants } from 'src/app/_provider/constants';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';

@Component({
  selector: 'app-programeditor',
  templateUrl: './programeditor.component.html',
  styleUrls: ['./programeditor.component.sass']
})
export class ProgrameditorComponent implements OnInit {

  @Input() data: any;
  public program: CCUProgram;


  constructor(
    public dataService: DataService,
    private menuItemService: MenuService
  ) {

  }

  setNewLastConditionFlag(): void {
    if (this.program.rulesets) {
      Object.keys(this.program.rulesets).forEach(ruleId => {
        const rule = this.program.rulesets[ruleId];
        let lastConditionsKey = '';
        if (rule.conditions) {
          Object.keys(rule.conditions).forEach(conditionsKey => {
            lastConditionsKey = conditionsKey;
            const conditionSet = rule.conditions[conditionsKey];
            conditionSet.lastConditionSet = false;
            const conditionList = conditionSet.condition;
            conditionList.forEach(condition => {
              condition.lastCondition = false;
            });
            if (conditionList[conditionList.length - 1]) {
              conditionList[conditionList.length - 1].lastCondition = true;
            }
          });
          if (rule.conditions[lastConditionsKey]) {
            rule.conditions[lastConditionsKey].lastConditionSet = true;
          }
        }
      });
    }
  }

  addNewCondtion(ruleId: string, conditionSetId: string, aPosition: string): void {
    let position = parseInt(aPosition, 10);
    // make sure we have a valid position
    if (isNaN(position) === true) {
      position = -1;
    }

    const rule = this.program.rulesets[parseInt(ruleId, 10)];
    let conditionSet;

    if (conditionSetId !== undefined) {
      conditionSet = rule.conditions[conditionSetId];
    }

    if (conditionSet === undefined) {
      conditionSet = {
        ruleCndOperatorType: 1,
        condition: [],
        lastConditionSet: true
      }

      if (rule.conditions === undefined) {
        rule.conditions = {};
      }

      rule.conditions[0] = conditionSet;
    }

    if (conditionSet) {
      const newPos = position + 1;
      // shift all contitions below the position one step back
      let cPos = Object.keys(conditionSet.condition).length - 1;
      while (cPos > position) {
        conditionSet.condition[cPos].lastCondition = false;
        conditionSet.condition[cPos + 1] = conditionSet.condition[cPos];
        cPos = cPos - 1;
      }

      // }
      conditionSet.condition[newPos] = {
        cid: 0,
        leftVal: '0',
        leftValType: 0,
        operatorType: 1,
        conditionType: 1,
        conditionType2: CCUConstants.rcCheckOnly,
        rightVal1: 0,
        conditionChannel: null,
        ruleDescription: '',
        rightVal1ValType: 0,
        rightVal2: 0,
        rightVal2ValType: 0,
        lastCondition: true,
        negateCondition: false,
        negateConditionText: 'ruleConditionLblWhen'
      };


      this.setNewLastConditionFlag();
    }
  }

  selectRuleCndOperatorType(ruleId: number, conditionId: number, newType: number): void {
    const rule = this.program.rulesets[ruleId];
    const conditionSet = rule.conditions[conditionId];
    conditionSet.ruleCndOperatorType = newType;
  }

  removeCondition(ruleId: number, conditionSetId: number, position: number): void {
    console.log('Remove Condition %s %s %s', ruleId, conditionSetId, position);
    const rule = this.program.rulesets[ruleId];
    const conditionSet = rule.conditions[conditionSetId];
    conditionSet.condition.splice(position, 1);
    // check if we can remove the complete condition set
    if (conditionSet.condition.length === 0) {
      delete rule.conditions[conditionSetId];
    }
    this.setNewLastConditionFlag();
  }

  hazConditions(ruleset): boolean {
    return ((ruleset.conditions !== undefined) && (Object.keys(ruleset.conditions).length > 0));
  }

  addNewDestination(ruleId: number, aPosition: string): void {
    console.log('addNewDestination %s - %s', ruleId, aPosition)
    const position = parseInt(aPosition, 10);
    const rule = this.program.rulesets[ruleId];
    if (rule.destinations === undefined) {
      console.log('add a new destination buffer');
      rule.destinations = {};
    } else {
      console.log('shifting');
      let cPos = Object.keys(rule.destinations).length - 1;
      while (cPos > position) {
        rule.destinations[cPos + 1] = rule.destinations[cPos];
        cPos = cPos - 1;
      }
    }
    const newPos = position + 1;
    rule.destinations[newPos] = {
      destinationId: 0,
      destinationChannel: 0,
      destinationDP: 0,
      destinationParam: 0,
      destinationValue: '',
      destinationValueParam: '0',
      destinationValueParamType: 0,
      destinationValueType: 0,
      destinationLabel: ''
    };
    console.log('Position %s added', newPos);
    this.rebuildEmptyDestinationFlag();
  }

  removeDestination(ruleId: number, aPosition: string): void {
    const position = parseInt(aPosition, 10);
    const rule = this.program.rulesets[ruleId];
    delete rule.destinations[aPosition];
    rule.destinations = this.dataService.programProvider.compressArray(rule.destinations);
    this.rebuildEmptyDestinationFlag();
  }

  rebuildEmptyDestinationFlag(): void {
    if (this.program.rulesets !== undefined) {
      Object.keys(this.program.rulesets).forEach(ruleID => {
        const rule = this.program.rulesets[ruleID];
        rule.emptyDestinations = (rule.destinations === undefined) || (Object.keys(rule.destinations).length === 0)
      });
    } else {
      this.program.rulesets = { 0: { emptyDestinations: true, lastRuleset: true, } };
    }
  }

  ngOnInit(): void {
    const prgKey = 'program';
    if (this.data[prgKey]) {
      this.program = JSON.parse(JSON.stringify(this.data[prgKey])); // make a copy ;
    } else {
      this.program = {
        id: CCUConstants.ID_ERROR,
        name: '${ruleTmpProgramName}',
        programInfo: '',
        active: true,
        internal: false
      }
    }
    this.rebuildEmptyDestinationFlag();
    this.setNewLastConditionFlag();
  }

  saveProgram(): void {
    console.log('saving program');
    console.log(this.program);
    this.dataService.programProvider.saveProgram(this.program);
    this.menuItemService.selectMenuItem('automation', { selectedTab: 'program' });
  }

  closeEditor(): void {
    this.menuItemService.selectMenuItem('automation', { selectedTab: 'program' });
  }
}
