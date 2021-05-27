/*
 * **************************************************************
 * File: network.service.ts
 * Project: hm-webexplorer-client
 * File Created: Thursday, 11th March 2021 8:48:44 pm
 * Author: Thomas Kluge (th.kluge@me.com>)
 * -----
 * Last Modified: Thursday, 13th May 2021 9:38:02 am
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
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NetworkConnection {
  protocol?: string,
  hostname?: string,
  name?: string,
  port?: number
}


export interface NetworkStatus {
  serverIsReachable: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class NetworkService {
  private $networkstatus$: BehaviorSubject<NetworkStatus>;
  private $connectionstatus$: BehaviorSubject<NetworkConnection>;

  public serverUrl: string;
  private apiVersion = '1';
  private currentConnection?: NetworkConnection

  constructor(
    private $http: HttpClient,
    private loc: Location
  ) {

    this.$networkstatus$ = new BehaviorSubject({ serverIsReachable: true });
    this.$connectionstatus$ = new BehaviorSubject({});
  }

  getCurrentConnectionName(): string {
    return this.currentConnection.name;
  }

  getCurrentConnection(): NetworkConnection {
    return this.currentConnection;
  }

  setConnection(newConnection: NetworkConnection): void {
    console.log('Settings connection to %s', JSON.stringify(newConnection))
    this.currentConnection = newConnection
    this.serverUrl = `${newConnection.protocol}//${newConnection.hostname}:${newConnection.port}`;
    this.$connectionstatus$.next(this.currentConnection);
  }

  get apiHost(): string {
    return this.serverUrl;
  }

  subscribeToNetworkStatus(): Observable<NetworkStatus> {
    return this.$networkstatus$.asObservable();
  }

  subscribeToConnectionStatus(): Observable<NetworkConnection> {
    return this.$connectionstatus$.asObservable();
  }

  getJsonData(method: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return new Promise((rslv) => {
      this.$http.get<any[]>(`${this.serverUrl}/api/${this.apiVersion}/${method}`, httpOptions).subscribe(
        data => {
          rslv(data);
          this.$networkstatus$.next({ serverIsReachable: true });
        },
        error => {
          console.log('Network Error : ', error);
          this.$networkstatus$.next({ serverIsReachable: false });
        }
      );
    });
  }

  putJsonData(method: string, object: any): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.$http.put<any[]>(`${this.serverUrl}/api/${this.apiVersion}/${method}`, object, httpOptions).toPromise();
  }


  postJsonData(method: string, object: any): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.$http.post<any[]>(`${this.serverUrl}/api/${this.apiVersion}/${method}`, object, httpOptions).toPromise();
  }

  patchJsonData(method: string, object: any): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.$http.patch<any[]>(`${this.serverUrl}/api/${this.apiVersion}/${method}`, object, httpOptions).toPromise();
  }

  deleteRequest(method: string): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.$http.delete<any[]>(`${this.serverUrl}/api/${this.apiVersion}/${method}`, httpOptions).toPromise();
  }

  getLogData(method: string): Promise<any> {
    const header = { Accept: "application/octet-stream" };
    let url = `${this.serverUrl}/api/${this.apiVersion}/${method}`
    return new Promise(resolve => {
      this.$http.get(url, { responseType: "blob" })
        .subscribe(response => {
          resolve(response)
        });
    })
  }

}

export class RPCError {
  code: number;
  faultCode: number;
  message: string;
}

export class RPCPutParamsetResult {
  message?: string;
  error?: RPCError;
}
