import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateGameComponent } from './shared/create-game/create-game.component';
import { GameMenuComponent } from './shared/game-menu/game-menu.component';
import { GameComponent } from './shared/game/game.component';
import { JoinGameComponent } from './shared/join-game/join-game.component';

const routes: Routes = [
  {
    path: '',
    component: GameMenuComponent,
  },
  {
    path: 'game/gameMenu',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'game/createGame',
    component: CreateGameComponent,
  },
  {
    path: 'game/joinGame',
    component: JoinGameComponent,
  },
  {
    path: 'game/:gameID',
    component: GameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
