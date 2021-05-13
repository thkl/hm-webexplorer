import { Component, OnInit, Input } from '@angular/core';
import { CCUProgram } from 'src/app/_interface/ccu/program';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { NetworkService } from 'src/app/_service/network.service';

@Component({
  selector: 'app-programlist',
  templateUrl: './programlist.component.html',
  styleUrls: ['./programlist.component.sass']
})
export class ProgramlistComponent implements OnInit {

  public programList: CCUProgram[];
  private $programList: CCUProgram[];
  public strHideInternalPrograms: string;
  public strHideInactivePrograms: string;
  private hideInactivePrograms: boolean;
  private hideInternalPrograms: boolean;
  private fltr: string;
  public programNameToDelete: string;
  public programToDelete: CCUProgram;

  constructor(
    public networkService: NetworkService,
    public dataService: DataService,
    private menuItemService: MenuService
  ) {
    this.hideInactivePrograms = this.dataService.programProvider.settings('hideInactive', true);
    this.hideInternalPrograms = this.dataService.programProvider.settings('hideInternal', true);
    this.updateMenuString();
  }

  sortTable(column: string) {

  }


  public setFilter(event: any): void {
    this.fltr = event.target.value;
    this.filter();
  }

  private filter(): void {

    this.programList = this.$programList.filter(program => {
      let rslt = true;

      if ((this.fltr) && (program.name.toLowerCase().indexOf(this.fltr.toLowerCase()) === -1)) {
        rslt = false;
      }

      if ((program.active === false) && (this.hideInactivePrograms === true)) {
        rslt = false;
      }

      if ((program.internal === true) && (this.hideInternalPrograms === true)) {
        rslt = false;
      }

      return rslt;
    });
  }


  toggleInactivePrograms(): void {
    this.hideInactivePrograms = !this.hideInactivePrograms;
    this.dataService.programProvider.storeSettings('hideInactive', this.hideInactivePrograms);
    this.updateMenuString();
    this.filter();
  }

  toggleInternalPrograms(): void {
    this.hideInternalPrograms = !this.hideInternalPrograms;
    this.dataService.programProvider.storeSettings('hideInternal', this.hideInternalPrograms);
    this.updateMenuString();
    this.filter();
  }

  updateMenuString(): void {
    this.strHideInternalPrograms = this.hideInternalPrograms ? 'Show internal programs' : 'Hide internal programs';
    this.strHideInactivePrograms = this.hideInactivePrograms ? 'Show inactive programs' : 'Hide inactive programs';
  }


  editProgram(programId: number): void {
    if (programId) {
      const program = this.dataService.programProvider.programById(programId);
      this.menuItemService.selectMenuItem('programeditor', { program });
    } else {
      this.menuItemService.selectMenuItem('programeditor', {});
    }
  }

  buildDescriptions(): void {
    this.programList.forEach(program => {
      this.dataService.programProvider.getProgramDetails(program.id).then(prg => {
        this.dataService.programProvider.parseProgram(this.dataService, program.id)

      })
    })
  }

  prepareDelete(program: CCUProgram) {
    this.programToDelete = program;
    this.programNameToDelete = program.name;
  }

  removeProgram() {
    this.dataService.programProvider.deleteProgram(this.programToDelete);
  }

  ngOnInit(): void {
    this.$programList = this.dataService.programProvider.programList;
    this.dataService.programProvider.subscribeToProgramList().subscribe(newProgramList => {
      this.$programList = newProgramList;
      this.filter();
    });
    this.filter();
    this.buildDescriptions()
  }

}
