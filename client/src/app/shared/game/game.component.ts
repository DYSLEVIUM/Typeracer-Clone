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
  players;
  gameCode;
  startBtnShow;
  updateGameSubscription: Subscription;
  timerStartSubscription: Subscription;
  timerEndSubscription: Subscription;

  updatingWPM;

  showTimer = false;
  timer;

  totalWords;

  @ViewChild('userInput') userInputElement: ElementRef;

  userInputDisabled = true;

  constructor(private socket: SocketConfigService, private router: Router) {
    try {
      this.players = this.socket.gameState.players;
      this.player = this.findPlayer(this.socket.gameState.players);

      this.totalWords = this.socket.gameState.words;
      this.gameCode = this.socket.gameState._id;

      this.startBtnShow = this.player.isPartyLeader;
    } catch (error) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.updateGameSubscription = this.socket.updateGame().subscribe((game) => {
      this.socket.gameState = game;
      this.players = this.socket.gameState.players;
      this.player = this.findPlayer(this.socket.gameState.players);
      this.totalWords = this.socket.gameState.words;

      if (this.socket.gameState.isOpen || this.socket.gameState.isOver) {
        this.disableUserInput();
      } else {
        this.enableUserInput();
      }

      this.players.sort((a, b) => (a.WPM > b.WPM ? -1 : b.WPM > a.WPM ? 1 : 0));

      let hasPartyLeader = false;

      this.socket.gameState.players.forEach((player) => {
        if (player.isPartyLeader) {
          hasPartyLeader = true;
        }
      });

      if (!hasPartyLeader) {
        this.router.navigate(['/']);
      }
    });

    this.timerStartSubscription = this.socket
      .timerStart()
      .subscribe((timerData) => {
        this.socket.timerState = timerData;
        this.timer = this.socket.timerState;
        this.showTimer = this.socket.gameState.isOver;

        this.showTimer = true;
        this.startBtnShow = false;

        if (this.socket.timerState.msg === 'gameEnd') {
          this.showTimer = false;
          this.startBtnShow = this.player.isPartyLeader;

          this.userInputElement.nativeElement.value = '';
        }

        if (
          this.socket.timerState.msg === 'gameEnd' ||
          this.socket.timerState.msg === 'playerEnd'
        ) {
          clearInterval(this.updatingWPM);
        }
      });

    this.timerEndSubscription = this.socket.timerEnd().subscribe();
  }

  ngOnDestroy(): void {
    try {
      this.updateGameSubscription.unsubscribe();
      this.timerStartSubscription.unsubscribe();
      this.timerEndSubscription.unsubscribe();
      this.socket.userLeft(this.socket.gameState._id, this.player._id);
    } catch (error) {}
  }

  findPlayer(players: Array<any>): any {
    return players.find(
      (player) => player.socketID === this.socket.getSocketID()
    );
  }

  startGame(): void {
    this.socket.startTimer(this.socket.gameState._id, this.player._id);
    this.updatingWPM = setInterval(() => {
      this.socket.userInputChanged('', this.socket.gameState._id);
    }, 300);
  }

  getTypedWords(): string {
    const typedWords = this.totalWords.slice(0, this.player.currWordIndex);

    return typedWords;
  }

  getCurrentWord(): any {
    return this.totalWords[this.player.currWordIndex];
  }

  getWordsToBeTyped(): any {
    const wordsToBeTyped = this.totalWords.slice(
      this.player.currWordIndex + 1,
      this.totalWords.length
    );

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
    const lastChar = event.charAt(event.length - 1);

    if (lastChar === ' ') {
      this.socket.userInputChanged(event, this.socket.gameState._id);

      event = '';
      this.userInputElement.nativeElement.value = '';
    }
  }

  calculatePercentageDone(player): string {
    return (
      ((player.currWordIndex / this.totalWords.length) * 100).toFixed(3) + ' %'
    );
  }

  copyToClipBoard(gameIDInput): void {
    gameIDInput.select();
    document.execCommand('copy');
    gameIDInput.setSelectionRange(0, 0);
  }
}
