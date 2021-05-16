import { Component, OnInit, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { DataService } from 'src/app/_service/data.service';
import './crega';

@Component({
  selector: 'app-scripteditor',
  templateUrl: './scripteditor.component.html',
  styleUrls: ['./scripteditor.component.sass']
})
export class ScripteditorComponent implements OnInit {

  private _sourceCode = "WriteLine('Hello World');\n";
  public scriptResult: string;

  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  readonly codemirrorOptions = {
    lineNumbers: true,
    theme: "default",
    mode: "text/x-rega",
    autofocus: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false
  };

  get sourceCode() {
    return this._sourceCode;
  }

  set sourceCode(value: string) {
    if (value !== this._sourceCode) {
      this._sourceCode = value;
    }
  }

  constructor(
    private dataService: DataService
  ) {
  }

  ngOnInit(): void {

  }

  refresh(): void {
    this.codeEditor.codeMirror.refresh()
  }

  executeScript(): void {
    this.scriptResult = "executing ..."
    this.dataService.programProvider.runScript(this.sourceCode).then(rslt => {
      this.scriptResult = unescape(decodeURI(rslt.STDOUT)).replace(/\+/g, ' ');
    })
  }

  testScript(): void {
    this.scriptResult = "checking ..."
    this.dataService.programProvider.testScript(this.sourceCode).then(rslt => {
      if (rslt.result === "") {
        this.scriptResult = "ok";
      } else {
        this.scriptResult = unescape(rslt.result);
      }
    })
  }
}
