import { ReadStream } from 'tty';
import { Color } from './color.enum';

export enum Key {
  x = 'x',
  ctrlC = 'ctrlC',
  digit1 = 'digit1',
  digit2 = 'digit2',
  digit3 = 'digit3',
  digit4 = 'digit4',
  arrowUp = 'arrowUp',
  arrowDown = 'arrowDown',
  arrowLeft = 'arrowLeft',
  arrowRight = 'arrowRight',
  unsupported = 'unsupported',
}

const rawToKeyMap: Record<string, Key> = {
  '1b5b41': Key.arrowUp,
  '1b5b42': Key.arrowDown,
  '1b5b43': Key.arrowRight,
  '1b5b44': Key.arrowLeft,
  '03': Key.ctrlC,
  '78': Key.x,
  '31': Key.digit1,
  '32': Key.digit2,
  '33': Key.digit3,
  '34': Key.digit4,
};

export class Console {
  private stdin = <ReadStream>process.openStdin();
  private rawBuffer: string[] = [];
  private stdout = process.stdout;
  private buffer: Key[] = [];
  private echo = false;

  constructor() {
    this.hideCursor();
    this.init();
  }

  get keyAvailable(): boolean {
    return this.buffer.length > 0;
  }

  init(): void {
    this.stdin.setRawMode(true);
    this.stdin.on('data', (chunk: Buffer) => {
      if (this.echo) {
        process.stdout.write(chunk);
      }
      const raw = chunk.toString('hex');
      const key = rawToKeyMap[raw] ?? Key.unsupported;
      if (key === Key.ctrlC) {
        this.destroy();
        process.exit();
      }
      this.buffer.push(key);
      this.rawBuffer.push(chunk.toString('utf8'));
    });
  }

  destroy(): void {
    this.stdin.pause();
  }

  async read(): Promise<Key> {
    if (this.keyAvailable) {
      return this.buffer.shift();
    }

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.keyAvailable) {
          clearInterval(interval);
          resolve(this.buffer.shift());
        }
      }, 5);
    });
  }

  async readLine(): Promise<string> {
    this.enableEcho();
    this.clearRawBuffer();

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const index = this.rawBuffer.indexOf('\r');
        if (index !== -1) {
          clearInterval(interval);
          resolve(this.rawBuffer.slice(0, index).join(''));
          this.disableEcho();
          this.clearRawBuffer();
        }
      }, 5);
    });
  }

  clear(): void {
    this.clearScreen();
    this.goto(0, 0);
  }

  goto(x: number, y: number): void {
    this.stdout.cursorTo(x, y);
  }

  write(line: string): void {
    this.stdout.write(line);
  }

  displayAtPoint(point: { x: number; y: number }, value: string, color = Color.reset): void {
    this.goto(point.x, point.y);
    this.write(`${color}${value}${Color.reset}`);
  }

  getSize(): [x: number, y: number] {
    return process.stdout.getWindowSize();
  }

  private enableEcho() {
    this.echo = true;
  }

  private disableEcho() {
    this.echo = false;
  }

  private clearRawBuffer() {
    this.rawBuffer = [];
  }

  private hideCursor(): void {
    this.write('\x1B[?25l');
  }

  private clearScreen(): void {
    this.write('\u001b[2J\u001b[0;0H');
  }
}
