import { Component } from '@angular/core';
import { SocketConfigService } from './core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'typeracer-clone';
  constructor(private socket: SocketConfigService) {}
}
