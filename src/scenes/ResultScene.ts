// ResultScene - 結果画面
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS, STAGES } from '../utils/constants';
import { IDOL_LIST } from '../characters/IdolData';
import { Otaku } from '../characters/OtakuData';

export class ResultScene extends Phaser.Scene {
  private selectedIdolIndex: number = 0;
  private stageId: number = 1;
  private won: boolean = false;
  private playerTeam: Otaku[] = [];

  constructor() {
    super({ key: 'ResultScene' });
  }

  init(data: { selectedIdolIndex: number; stageId: number; won: boolean; playerTeam: Otaku[] }): void {
    this.selectedIdolIndex = data.selectedIdolIndex;
    this.stageId = data.stageId;
    this.won = data.won;
    this.playerTeam = data.playerTeam;
  }

  create(): void {
    this.cameras.main.fadeIn(500);

    // 背景
    const bg = this.add.graphics();
    if (this.won) {
      bg.fillGradientStyle(0x2e1a4e, 0x2e1a4e, 0x4e2a1a, 0x4e2a1a, 1);
    } else {
      bg.fillGradientStyle(0x1a0a1e, 0x1a0a1e, 0x0a0a1e, 0x0a1e0a, 1);
    }
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const stage = STAGES[this.stageId - 1];
    const idol = IDOL_LIST[this.selectedIdolIndex];

    // 結果テキスト
    if (this.won) {
      this.add.text(GAME_WIDTH / 2, 80, '🎉 ステージクリア！ 🎉', {
        fontSize: '48px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.ACCENT_GOLD,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 140, `${stage?.name ?? 'ステージ'}を制覇！`, {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
      }).setOrigin(0.5);
    } else {
      this.add.text(GAME_WIDTH / 2, 80, '💔 敗北… 💔', {
        fontSize: '48px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.DANGER_RED,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 4,
      }).setOrigin(0.5);

      this.add.text(GAME_WIDTH / 2, 140, `${stage?.rivalName ?? 'ライバル'}に負けてしまった…`, {
        fontSize: '24px',
        fontFamily: FONT_FAMILY,
        color: '#AAAAAA',
      }).setOrigin(0.5);
    }

    // アイドル表示
    this.add.image(GAME_WIDTH / 2, 300, `idol_${this.selectedIdolIndex}_large`).setScale(0.6);
    this.add.text(GAME_WIDTH / 2, 410, idol.name, {
      fontSize: '22px',
      fontFamily: FONT_FAMILY,
      color: idol.hairColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // チーム情報
    const teamY = 460;
    this.add.text(GAME_WIDTH / 2, teamY, `手持ちヲタク: ${this.playerTeam.length}人`, {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.SUB_LAVENDER,
    }).setOrigin(0.5);

    // ボタン
    const buttonY = 560;

    if (this.won && this.stageId < STAGES.length) {
      // 次のステージへ
      const nextBtn = this.add.image(GAME_WIDTH / 2, buttonY, 'btn_pink').setInteractive({ useHandCursor: true });
      this.add.text(GAME_WIDTH / 2, buttonY, '次のステージへ', {
        fontSize: '22px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      nextBtn.on('pointerdown', () => {
        this.cameras.main.fadeOut(500);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('TokutenkaiScene', {
            selectedIdolIndex: this.selectedIdolIndex,
            stageId: this.stageId + 1,
          });
        });
      });
    } else if (this.won) {
      // 全ステージクリア
      this.add.text(GAME_WIDTH / 2, 500, '🏆 全ステージクリア！おめでとう！ 🏆', {
        fontSize: '28px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.ACCENT_GOLD,
        fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    // リトライボタン
    const retryBtn = this.add.image(GAME_WIDTH / 2 - 150, buttonY + 70, 'btn_blue').setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2 - 150, buttonY + 70, 'リトライ', {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    retryBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TokutenkaiScene', {
          selectedIdolIndex: this.selectedIdolIndex,
          stageId: this.stageId,
        });
      });
    });

    // タイトルへ
    const titleBtn = this.add.image(GAME_WIDTH / 2 + 150, buttonY + 70, 'btn_purple').setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2 + 150, buttonY + 70, 'タイトルへ', {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    titleBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TitleScene');
      });
    });

    // 勝利時の継続パーティクル
    if (this.won) {
      this.time.addEvent({
        delay: 300,
        repeat: 20,
        callback: () => {
          const colors = ['#FF69B4', '#FFD700', '#87CEEB'];
          const star = this.add.text(
            Math.random() * GAME_WIDTH,
            -10,
            '✦',
            {
              fontSize: `${12 + Math.random() * 16}px`,
              color: colors[Math.floor(Math.random() * colors.length)],
            }
          ).setOrigin(0.5);
          this.tweens.add({
            targets: star,
            y: GAME_HEIGHT + 20,
            x: star.x + (Math.random() - 0.5) * 100,
            alpha: 0,
            duration: 2000,
            onComplete: () => star.destroy(),
          });
        },
      });
    }
  }
}
