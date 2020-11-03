import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  constructor(private socket: SocketConfigService) {}

  ngOnInit(): void {
    this.socket.updateGame().subscribe((game) => {
      //  setting up the game on initial load and listening for changes
      console.log(game);
    });
  }
}
