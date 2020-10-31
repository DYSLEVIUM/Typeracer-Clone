import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss'],
})
export class GameMenuComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  joinGame(): void {
    console.log('Join Game Clicked');
  }

  createGame(): void {
    console.log('Create Game Clicked');
  }
}
