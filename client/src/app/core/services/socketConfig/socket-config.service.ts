import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketConfigService {
  socket: SocketIOClient.Socket = io('http://localhost:3000');

  constructor() {
    this.socket.on('test', (msg) => {
      console.log(msg);
    });
  }
}
