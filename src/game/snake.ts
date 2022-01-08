import { Point } from './point';
import { IRenderer } from './renderer.interface';

export class Snake {
  private body: Point[];
  private initialLength = 5;
  direction: 'up' | 'down' | 'right' | 'left';

  constructor(private getWindowSize: () => [x: number, y: number]) {
    this.reset();
  }

  get head(): Point {
    return this.body[0];
  }

  get tail(): Point {
    return this.body[this.length - 1];
  }
  reset(): void {
    this.body = [];
    for (let i = 0; i < this.initialLength; i += 1) {
      this.body.push(new Point(20, 3 + i));
    }
  }

  display(renderHead: IRenderer, renderBody: IRenderer): void {
    this.body.forEach((point: Point) => {
      if (point.equals(this.head)) {
        return renderHead(point, '*');
      }
      return renderBody(point, '*');
    });
  }

  setDirectionUp(): void {
    this.direction = 'up';
  }

  setDirectionDown(): void {
    this.direction = 'down';
  }

  setDirectionRight(): void {
    this.direction = 'right';
  }

  setDirectionLeft(): void {
    this.direction = 'left';
  }

  move(step = 1): void {
    this.removeTail();
    const next = this.getNextHead(step);
    if (!this.isLegalMove(next)) {
      throw new Error('Game Over');
    }
    this.body.unshift(next);
  }

  removeTail(): void {
    this.body.pop();
  }

  addTail(step = 1): void {
    const tail = new Point(this.tail.x + step, this.tail.y);
    this.body.push(tail);
  }

  contains(point: Point): boolean {
    return this.body.some((ownPoint) => ownPoint.equals(point));
  }

  isLegalMove(point: Point): boolean {
    return !this.contains(point) && this.checkBorders(point);
  }

  private checkBorders(point: Point): boolean {
    const [x, y] = this.getWindowSize();
    switch (this.direction) {
      case 'up':
        return point.y >= 0;
      case 'down':
        return point.y < y;
      case 'right':
        return point.x < x;
      case 'left':
        return point.x >= 0;
    }
  }

  private get length() {
    return this.body.length;
  }

  private getNextHead(step: number) {
    switch (this.direction) {
      case 'up':
        return new Point(this.head.x, this.head.y - step);
      case 'down':
        return new Point(this.head.x, this.head.y + step);
      case 'left':
        return new Point(this.head.x - step, this.head.y);
      case 'right':
        return new Point(this.head.x + step, this.head.y);
    }
  }
}
