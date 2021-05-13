import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';
import { MenuService } from 'src/app/_service/menuservice';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deviceautomation',
  templateUrl: './deviceautomation.component.html',
  styleUrls: ['./deviceautomation.component.sass']
})


export class SideBarDeviceAutomationComponent implements OnInit {
  @Input() data: any;

  private linkToRemove: any;

  constructor(
    private dataService: DataService,
    private menuItemService: MenuService,
    private modalService: NgbModal
  ) { }



  selectLink(sender: string, receiver: string): void {
    this.menuItemService.selectMenuItem('linkeditor', { device: this.data, sender, receiver });
  }

  doRemoveLink(): void {
    if ((this.linkToRemove) && (this.linkToRemove.sender)) {
      this.dataService.deviceProvider.removeLinkForDevice(this.data, this.linkToRemove.sender, this.linkToRemove.receiver).then(() => {
        this.updateLinks();
        this.modalService.dismissAll();
      });
    }
  }

  cancelDeleteLink(): void {
    this.modalService.dismissAll();
    this.linkToRemove = {};
  }

  removeLink(content: any, sender: string, receiver: string): void {
    this.linkToRemove = { sender, receiver };
    this.modalService.open(content, { size: 'md' });
  }

  updateLinks(): void {
    this.dataService.deviceProvider.getLinksForDevice(this.data).then(links => {

      this.data.links = [];
      links.forEach(link => {
        const sndrDevice = link.SENDER.split(':')[0];
        const recvDevice = link.RECEIVER.split(':')[0];

        if (sndrDevice !== recvDevice) {
          this.dataService.deviceProvider.lookupDevicesForLink(link);
          this.data.links.push(link);
        }

      });
    });
  }

  updatePrograms(): void {
    this.dataService.deviceProvider.getProgramIDsForDevice(this.data).then(prgids => {
      this.data.programs = [];
      const cnlst = prgids.channels;
      if (cnlst) {
        cnlst.forEach(chnl => {
          chnl.pids.forEach(pid => {
            const prg = this.dataService.programProvider.programById(pid);
            if (prg) {
              if (this.data.programs.indexOf(prg) === -1) {
                this.data.programs.push(prg);
              }
            }
          });
        });
      }
      console.log(this.data.programs)
    });
  }

  selectProgram(program: any): void {
    this.dataService.programProvider.getProgramDetails(program.id).then(prg => {
      this.dataService.programProvider.parseProgram(this.dataService, program.id);
      this.menuItemService.selectMenuItem('programeditor', { program });
    });
  }

  removeProgram(prgid: number): void {

  }

  ngOnInit(): void {
    if (this.data.links === undefined) {
      this.updateLinks();
    }
    if (this.data.programs === undefined) {
      this.updatePrograms();
    }
  }
}
