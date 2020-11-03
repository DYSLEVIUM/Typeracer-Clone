import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit {
  nickName = '';

  constructor(private socket: SocketConfigService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(createGame: NgForm): void {
    this.socket.createGame(this.nickName);

    this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
      this.router.navigate(['game/', game._id]);
    });
  }
}
