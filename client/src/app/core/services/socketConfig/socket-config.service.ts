import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketConfigService {
  constructor() {}
  socket: SocketIOClient.Socket = io('http://localhost:3000');

  gameStateObs: Observer<{
    id: string;
    isOpen: boolean;
    players: any[];
    words: string[];
  }>;

  gameState;

  createGame(nickName: string): void {
    this.socket.emit('createGame', nickName);
  }

  joinGame(gameID: string, nickName: string): void {
    this.socket.emit('joinGame', { gameID, nickName });
  }

  updateGame(): Observable<any> {
    this.socket.on('updateGame', (game) => {
      this.gameStateObs.next(game);
    });

    return new Observable((game) => {
      this.gameStateObs = game;
    });
  }

  removeSocket(): void {
    this.socket.removeAllListeners();
  }

  getSocketID(): string {
    return this.socket.id;
  }
}
