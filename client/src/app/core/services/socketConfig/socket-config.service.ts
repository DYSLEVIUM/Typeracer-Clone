import { Injectable } from '@angular/core';
import { Observable, Observer, EMPTY } from 'rxjs';
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

  timerObs: Observer<{
    countdown: number;
    msg: string;
  }>;

  gameState;
  timerState;

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

  timerStart(): Observable<any> {
    this.socket.on('timer', (timerData) => {
      this.timerObs.next(timerData);
    });

    return new Observable((timerData) => {
      this.timerObs = timerData;
    });
  }
  timerEnd(): Observable<any> {
    this.socket.on('done', (timerData) => {
      this.timerObs.next(timerData);
    });

    return EMPTY;
  }

  removeSocket(): void {
    this.socket.removeAllListeners();
  }

  removeListener(listener): void {
    this.socket.removeListener(listener);
  }

  getSocketID(): string {
    return this.socket.id;
  }

  startTimer(gameID, playerID): void {
    this.socket.emit('startTimer', { gameID, playerID });
  }

  userInputChanged(userInput, gameID): void {
    this.socket.emit('userInput', { userInput, gameID });
  }

  userLeft(gameID, playerID): void {
    this.socket.emit('userLeft', { gameID, playerID });
  }
}
