import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketConfigService } from 'src/app/core/services/socketConfig/socket-config.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  player;
  startBtnShow = true;
  updateGameSubscription: Subscription;
  timerStartSubscription: Subscription;
  timerEndSubscription: Subscription;

  showTimer = false;
  timer;

  totalWords;

  @ViewChild('userInput') userInputElement: ElementRef;
  userInputVal;

  userInputDisabled = true;

  constructor(private socket: SocketConfigService, private router: Router) {
    this.player = this.findPlayer(socket.gameState.players);

    //  navigating player back who entered without id from route
    if (socket.gameState._id === '' || typeof this.player === 'undefined') {
      this.router.navigateByUrl('/');
    }

    this.totalWords = socket.gameState.words;
  }

  ngOnInit(): void {
    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
      this.player = this.findPlayer(this.socket.gameState.players);
    });

    this.timerStartSubscription = this.socket
      .timerStart()
      .subscribe((timerData) => {
        this.startBtnShow = false;
        this.socket.timerState = timerData;
        this.timer = this.socket.timerState;

        if (
          (this.socket.timerState.msg === 'countdown' &&
            this.socket.timerState.countDown === 0) ||
          this.socket.timerState.msg === 'started'
        ) {
          this.enableUserInput();
        }

        this.showTimer = true;
      });

    this.timerEndSubscription = this.socket.timerEnd().subscribe(() => {
      this.socket.removeListener('timer');
      this.disableUserInput();
      console.log('called');
    });
  }

  ngOnDestroy(): void {
    this.updateGameSubscription.unsubscribe();
    this.timerStartSubscription.unsubscribe();
    this.timerEndSubscription.unsubscribe();
  }

  findPlayer(players: Array<any>): any {
    return players.find(
      (player) => player.socketID === this.socket.getSocketID()
    );
  }

  startGame(): void {
    this.socket.startTimer(this.socket.gameState._id, this.player._id);
  }

  getTypedWords() {
    let typedWords = this.totalWords.slice(0, this.player.currWordIndex);
    typedWords = typedWords.join('');

    return typedWords;
  }

  getCurrentWord(): any {
    return this.totalWords[this.player.currWordIndex];
  }

  getWordsToBeTyped(): any {
    let wordsToBeTyped = this.totalWords.slice(
      this.player.currWordIndex + 1,
      this.totalWords.length
    );

    wordsToBeTyped = wordsToBeTyped.join(' ');

    return wordsToBeTyped;
  }

  enableUserInput(): void {
    this.userInputElement.nativeElement.focus();
    this.userInputDisabled = false;
  }

  disableUserInput(): void {
    this.userInputDisabled = true;
  }

  userInputChanged(event: string): void {
    const prevPlayerWordInd = this.player.currWordIndex;
    const lastChar = event.charAt(event.length - 1);
    if (lastChar === ' ') {
      this.socket.userInputChanged(event, this.socket.gameState._id);
      this.userInputVal = '';
      event = '';
      this.userInputElement.nativeElement.value = '';

      console.log(this.player.WPM);
    }
  }
}
