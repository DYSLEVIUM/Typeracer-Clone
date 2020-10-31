import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameMenuComponent } from './shared/game-menu/game-menu.component';

const routes: Routes = [
  {
    path: '',
    component: GameMenuComponent,
  },
  {
    path: 'gameMenu',
    component: GameMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
