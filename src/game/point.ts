export class Point {
  constructor(private $x: number = 0, private $y: number = 0) {}

  get x(): number {
    return this.$x;
  }

  get y(): number {
    return this.$y;
  }

  set(x: number, y: number): void {
    this.$x = x;
    this.$y = y;
  }

  equals(that: Point): boolean {
    if (!that) return false;

    return this.$x === that.x && this.$y === that.y;
  }
}
