import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  player;

  constructor(private socket: SocketConfigService, private router: Router) {
    this.player = this.findPlayer(socket.gameState.players);

    //  navigating player back who entered without id from route
    if (socket.gameState.id === '' || typeof this.player === 'undefined') {
      this.router.navigateByUrl('/');
    }
  }

  ngOnInit(): void {
    this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
    });
  }

  findPlayer(players: Array<any>) {
    return players.find(
      (player) => player.socketID === this.socket.getSocketID()
    );
  }
}
