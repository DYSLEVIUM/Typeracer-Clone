import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GameMenuComponent } from './game-menu/game-menu.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    GameMenuComponent,
    CreateGameComponent,
    JoinGameComponent,
    GameComponent,
  ],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [GameMenuComponent],
})
export class SharedModule {}
