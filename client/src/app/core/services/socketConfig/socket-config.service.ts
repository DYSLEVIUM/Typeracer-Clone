import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketConfigService {
  constructor() {}
  socket: SocketIOClient.Socket = io('http://localhost:3000');

  gameState: Observer<{
    id: string;
    isOpen: boolean;
    players: any[];
    words: string[];
  }>;

  createGame(nickName: string): void {
    this.socket.emit('createGame', nickName);
  }

  joinGame(gameID: string, nickName: string): void {
    this.socket.emit('joinGame', { gameID, nickName });
  }

  updateGame(): Observable<any> {
    this.socket.on('updateGame', (game) => {
      this.gameState.next(game);
    });

    return new Observable((game) => {
      this.gameState = game;
    });
  }

  removeSocket(): void {
    this.socket.removeAllListeners();
  }
}
