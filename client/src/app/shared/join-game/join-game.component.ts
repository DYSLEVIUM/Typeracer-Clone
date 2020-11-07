import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit, OnDestroy {
  gameID = '';
  nickName = '';
  updateGameSubscription: Subscription;
  constructor(private socket: SocketConfigService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    try {
      this.updateGameSubscription.unsubscribe();
      this.socket.removeListener('joinGame');
    } catch (error) {
      this.router.navigate(['/joinGame']);
    }
  }

  onSubmit(joinGame: NgForm): void {
    this.socket.joinGame(this.gameID, this.nickName);

    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
      this.router.navigate(['game/', game._id]);
    });
  }
}
