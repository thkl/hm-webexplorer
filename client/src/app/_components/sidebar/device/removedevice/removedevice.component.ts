import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-removedevice',
  templateUrl: './removedevice.component.html',
  styleUrls: ['./removedevice.component.sass']
})
export class SideBarRemovedeviceComponent implements OnInit {

  @Input() onDelete: EventEmitter<object>;
  @Input() data: any;
  constructor(
    public dataService: DataService
  ) { }

  ngOnInit(): void {
  }


  removeDevice(): void {
    this.dataService.deviceProvider.removeDevice(this.data.serial).then(() => {
      this.onDelete.emit(null);
    });
  }
}
