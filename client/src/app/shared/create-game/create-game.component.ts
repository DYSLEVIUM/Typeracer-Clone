import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit, OnDestroy {
  nickName = '';
  updateGameSubscription: Subscription;

  constructor(private socket: SocketConfigService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    try {
      this.updateGameSubscription.unsubscribe();
      this.socket.removeListener('joinGame');
    } catch (error) {
      this.router.navigate(['/createGame']);
    }
  }

  onSubmit(createGame: NgForm): void {
    this.socket.createGame(this.nickName);

    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
      this.router.navigate(['game/', game._id]);
    });
  }
}
