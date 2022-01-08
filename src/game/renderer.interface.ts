export interface IRenderer {
  (p: { x: number; y: number }, c: string): void;
}
