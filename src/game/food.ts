import { randomInt } from 'node:crypto';
import { Point } from './point';
import { IRenderer } from './renderer.interface';

export class Food {
  position = new Point();

  constructor(private getWindowSize: () => [x: number, y: number]) {
    this.reset();
  }

  reset(): void {
    const [maxX, maxY] = this.getWindowSize();
    this.position.set(randomInt(maxX - 1), randomInt(maxY - 1));
  }

  display(render: IRenderer): void {
    render(this.position, this.toString());
  }

  toString(): string {
    return '@';
  }
}
