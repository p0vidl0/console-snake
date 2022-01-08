import { resolve } from 'node:path';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { Player } from './player';

export class Statistics {
  list: Player[];
  filePath = resolve(__dirname, '../../statistics.json');

  constructor() {
    this.load();
  }

  addPlayer(player: Player): void {
    this.list.push(player);
    this.sortList();
  }

  sortList(): Player[] {
    return this.list.sort((a, b) => (a.score < b.score ? 1 : -1));
  }

  load(): void {
    const fileExists = existsSync(this.filePath);
    if (!fileExists) {
      this.list = [];
      return;
    }
    const raw = readFileSync(this.filePath);
    this.list = <Player[]>JSON.parse(raw.toString('utf8')).map((p) => new Player(p.name, p.score));
  }

  save(): void {
    const string = JSON.stringify(this.sortList().slice(-10));
    writeFileSync(this.filePath, string);
  }
}
