export class Player {
  constructor(public name = 'Default Name', public score = 0) {}

  incrementScore(): void {
    this.score += 1;
  }

  cleanScore(): void {
    this.score = 0;
  }

  toString(): string {
    return `Player name: ${this.name}, score: ${this.score}`;
  }
}
