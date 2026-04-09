import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './utils/constants';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { IdolSelectScene } from './scenes/IdolSelectScene';
import { TokutenkaiScene } from './scenes/TokutenkaiScene';
import { BattleScene } from './scenes/BattleScene';
import { ResultScene } from './scenes/ResultScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    min: { width: 320, height: 180 },
    max: { width: 1920, height: 1080 },
  },
  backgroundColor: COLORS.BG_DARK_PURPLE,
  scene: [BootScene, TitleScene, IdolSelectScene, TokutenkaiScene, BattleScene, ResultScene],
};

new Phaser.Game(config);
