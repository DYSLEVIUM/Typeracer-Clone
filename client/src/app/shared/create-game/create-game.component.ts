import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
    //  first unsubscribe then remove all listeners
    this.updateGameSubscription.unsubscribe();
    this.socket.removeSocket();
  }

  onSubmit(createGame: NgForm): void {
    this.socket.createGame(this.nickName);

    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      console.log(game);
      this.router.navigate(['game/', game._id]);
    });
  }
}
