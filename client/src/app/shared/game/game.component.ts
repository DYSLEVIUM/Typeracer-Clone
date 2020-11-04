import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  player;
  startBtnShow = true;
  updateGameSubscription: Subscription;
  timerStartSubscription: Subscription;
  timerEndSubscription: Subscription;

  showTimer = false;
  timer;

  constructor(private socket: SocketConfigService, private router: Router) {
    this.player = this.findPlayer(socket.gameState.players);

    //  navigating player back who entered without id from route
    if (socket.gameState._id === '' || typeof this.player === 'undefined') {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
    });

    this.timerStartSubscription = this.socket
      .timerStart()
      .subscribe((timerData) => {
        this.startBtnShow = false;
        this.socket.timerState = timerData;

        this.timer = this.socket.timerState;
        this.showTimer = true;
      });

    this.timerEndSubscription = this.socket.timerEnd().subscribe(() => {
      this.socket.removeListener('timer');
    });
  }

  ngOnDestroy(): void {
    this.updateGameSubscription.unsubscribe();
    this.timerStartSubscription.unsubscribe();
    this.timerEndSubscription.unsubscribe();
  }

  findPlayer(players: Array<any>): any {
    return players.find(
      (player) => player.socketID === this.socket.getSocketID()
    );
  }

  startGame(): void {
    this.socket.startTimer(this.socket.gameState._id, this.player._id);
  }
}
