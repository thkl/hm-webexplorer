import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-syslog',
  templateUrl: './syslog.component.html',
  styleUrls: ['./syslog.component.sass']
})
export class SyslogComponent implements OnInit {

  public logMessage: string;
  public selectedLog: string;
  public availableLogs: {};
  public loading: boolean;

  constructor(
    private dataService: DataService
  ) {

    this.availableLogs = {
      'syslog': 'CCU Syslog',
      'hmserver': 'HM Server',
      'http-access': 'Http Server Access',
      'http-error': 'Http Server Error'
    }

    this.selectedLog = 'syslog'
  }

  ngOnInit(): void {
    this.getLog('syslog');
  }

  getLog(logtype: string): void {
    this.loading = true;
    this.selectedLog = logtype;
    this.dataService.coreProvider.fetchLogFile(logtype).then(msg => {
      this.logMessage = msg
      this.loading = false;
    });
  }
}
