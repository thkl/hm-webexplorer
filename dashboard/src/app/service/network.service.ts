import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SocketOne } from './socket';
import { CCUEvent } from '../interface/CCUEvent';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private serverUrl: string;
  private apiUrl: string;
  private socket: SocketOne;
  private $ccuevent$: BehaviorSubject<CCUEvent>;

  constructor(
    private _http: HttpClient
  ) {
    if (environment.production === true) {
      this.serverUrl = `${window.location.protocol}${window.location.hostname}:1234/`
      this.apiUrl = `${window.location.protocol}${window.location.hostname}:1234/${environment.apiPath}${environment.apiVersion}`
    } else {
      this.serverUrl = environment.serverUrl
      this.apiUrl = `${environment.serverUrl}${environment.apiPath}${environment.apiVersion}`
    }
    this.$ccuevent$ = new BehaviorSubject(new CCUEvent());
    this.refreshSocketConnection();
  }

  subscribeToCCUEvents(): Observable<CCUEvent> {
    return this.$ccuevent$.asObservable();
  }

  getJsonData(method: string): Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return new Promise((rslv) => {
      this._http.get<any[]>(`${this.apiUrl}/${method}`, httpOptions).subscribe(
        data => {
          rslv(data);
        },
        error => {
          console.log('Network Error : ', error);
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
    return this._http.put<any[]>(`${this.apiUrl}/${method}`, object, httpOptions).toPromise();
  }


  postJsonData(method: string, object: any): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post<any[]>(`${this.apiUrl}/${method}`, object, httpOptions).toPromise();
  }

  patchJsonData(method: string, object: any): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.patch<any[]>(`${this.apiUrl}/${method}`, object, httpOptions).toPromise();
  }

  deleteRequest(method: string): Promise<any[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.delete<any[]>(`${this.apiUrl}/${method}`, httpOptions).toPromise();
  }

  socketMessageHandler(payload: any) {
    let type = Object.keys(payload)[0]
    switch (type) {
      case 'event':
        const event: CCUEvent = payload[type];
        this.$ccuevent$.next(event);
        break;
    }
  }

  refreshSocketConnection() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = new SocketOne(this.serverUrl)

    this.socket.on("connect", () => {
      console.log('connected'); // true
      this.socket.emit('Register Services')
    });

    this.socket.on("message", (arg: any) => {
      try {
        let payload = JSON.parse(arg);
        this.socketMessageHandler(payload);
      } catch (e) {

      }
    })

  }


}
