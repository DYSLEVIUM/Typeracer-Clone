import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss'],
})
export class JoinGameComponent implements OnInit {
  gameID = '';
  nickName = '';
  constructor(private socket: SocketConfigService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(joinGame: NgForm): void {
    this.socket.joinGame(this.gameID, this.nickName);

    this.socket.updateGame().subscribe((game) => {
      console.log(game);
      this.router.navigate(['game/', game._id]);
    });
  }
}
