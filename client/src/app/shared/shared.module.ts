import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameMenuComponent } from './game-menu/game-menu.component';

@NgModule({
  declarations: [GameMenuComponent],
  imports: [CommonModule],
  exports: [GameMenuComponent],
})
export class SharedModule {}
