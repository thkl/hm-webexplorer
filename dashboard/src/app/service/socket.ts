import { Inject, Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class SocketOne extends Socket {

    constructor(@Inject(String) private url: string) {
        super({ url: url, options: { path: '/websockets/', transports: ["websocket"] } });
    }
}
