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

export interface NetworkStatus {
  serverIsReachable: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class NetworkService {


  private $networkstatus$: BehaviorSubject<NetworkStatus>;

  public serverUrl: string;
  private apiVersion = '1';

  constructor(
    private $http: HttpClient,
    private loc: Location
  ) {
    this.serverUrl = `${window.location.protocol}//${window.location.hostname}:1234`;
    this.$networkstatus$ = new BehaviorSubject({ serverIsReachable: true });
  }

  get apiHost(): string {
    return this.serverUrl;
  }


  subscribeToNetworkStatus(): Observable<NetworkStatus> {
    return this.$networkstatus$.asObservable();
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
