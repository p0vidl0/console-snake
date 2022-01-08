import { setTimeout } from 'node:timers/promises';
import { Player } from '../statistics/player';
import { Color } from '../console/color.enum';
import { Console, Key } from '../console/console';
import { Statistics } from '../statistics/statistics';
import { Food } from './food';
import { Snake } from './snake';

export class Game {
  private console = new Console();
  private food = new Food(() => this.console.getSize());
  private snake = new Snake(() => this.console.getSize());
  private statistics = new Statistics();
  private player = new Player();
  private difficulty = 150;

  async mainProcess(): Promise<void> {
    this.console.clear();
    let command = Key.unsupported;

    while (command !== Key.digit4) {
      this.displayMenu();
      command = await this.console.read();

      switch (command) {
        case Key.digit1:
          this.console.clear();
          await this.gameProcess();
          break;
        case Key.digit2:
          this.console.clear();
          await this.gameOptions();
          break;
        case Key.digit3:
          this.console.clear();
          await this.statistic();
          break;
      }

      this.console.clear();
    }

    this.close();
  }

  displayFood(): void {
    this.food.display((p, c) => this.console.displayAtPoint(p, c, Color.red));
  }

  displaySnake(): void {
    this.snake.display(
      (p, c) => this.console.displayAtPoint(p, c, Color.yellow),
      (p, c) => this.console.displayAtPoint(p, c, Color.green),
    );
  }

  async gameProcess(): Promise<void> {
    this.console.write('Press any key to start... or X to quit');
    this.displayFood();
    this.displaySnake();

    let command = Key.unsupported;
    while (true) {
      if (this.console.keyAvailable) {
        command = await this.console.read();

        switch (command) {
          case Key.x:
            return;
          case Key.arrowDown:
            this.snake.setDirectionDown();
            await this.moveSnake();
            break;
          case Key.arrowUp:
            this.snake.setDirectionUp();
            await this.moveSnake();
            break;
          case Key.arrowLeft:
            this.snake.setDirectionLeft();
            await this.moveSnake();
            break;
          case Key.arrowRight:
          default:
            this.snake.setDirectionRight();
            await this.moveSnake();
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      await setTimeout(1);
    }
  }

  close(): void {
    this.console.destroy();
  }

  displayMenu(): void {
    Game.menu().forEach((line) => this.console.write(`${line}\n`));
  }

  displayOptionsMenu(): void {
    Game.menuOptions().forEach((line) => this.console.write(`${line}\n`));
  }

  async gameOptions(): Promise<void> {
    this.displayOptionsMenu();

    const command = await this.console.read();

    switch (command) {
      case Key.digit1:
        this.console.clear();
        this.console.write(`Current player name: ${this.player.name}\n`);
        this.console.write('Set new player name\n');

        const name = await this.console.readLine();
        this.player.name = name;

        this.console.clear();
        break;
      case Key.digit2:
        this.console.clear();
        this.console.write(`Current difficulty: ${this.difficulty}\n`);
        this.console.write('Set new difficulty\n');

        const difficulty = await this.console.readLine();
        this.difficulty = Number.parseInt(difficulty);

        this.console.clear();
        break;
    }
  }

  async statistic(): Promise<void> {
    this.statistics = new Statistics();
    this.console.goto(0, 0);
    this.statistics.list.forEach((player, index) => {
      this.console.write(`${index + 1}. ${player.toString()}\n`);
    });

    await this.console.read();
  }

  private async moveSnake(): Promise<void> {
    try {
      while (!this.console.keyAvailable) {
        this.updateTitle();
        this.snake.move();
        this.displayFood();
        this.displaySnake();

        if (this.snake.head.equals(this.food.position)) {
          this.player.incrementScore();
          this.updateTitle();
          this.food.reset();

          while (this.snake.contains(this.food.position)) {
            this.food.reset();
          }

          this.snake.addTail();
        }

        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        await setTimeout(this.difficulty);
        this.console.clear();
      }
    } catch (error) {
      this.console.clear();
      this.console.goto(0, 0);
      this.console.write('Game over. Press any key to play again');

      this.statistics.addPlayer(this.player);
      this.statistics.save();

      this.food.reset();
      this.displayFood();

      this.snake.reset();
      this.displaySnake();

      this.player.cleanScore();
    }
  }

  private updateTitle(): void {
    const title = `Player name: ${this.player.name}. Current count: ${this.player.score}.  `;
    this.console.goto(0, 0);
    this.console.write(title);
  }

  private static menu() {
    return ['1. New game', '2. Options', '3. Statistics', '4. Exit'];
  }

  private static menuOptions() {
    return ['1. Change player name', '2. Change difficulty'];
  }
}
