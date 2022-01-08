import { Game } from './game/game';

const game = new Game();

const signals = ['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGBREAK', 'SIGKILL'];
signals.forEach((signal) =>
  process.on(signal, () => {
    process.exit();
  }),
);

game.mainProcess().catch((error) => console.error(error));
