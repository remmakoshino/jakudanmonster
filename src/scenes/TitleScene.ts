// TitleScene - タイトル画面
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS, COLORS } from '../utils/constants';

export class TitleScene extends Phaser.Scene {
  private particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
  private gfx!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    // 背景グラデーション
    this.gfx = this.add.graphics();
    this.drawBackground();

    // パーティクル初期化
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * GAME_HEIGHT,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1 - 0.3,
        size: Math.random() * 8 + 3,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // タイトルロゴ
    const titleShadow = this.add.text(GAME_WIDTH / 2 + 3, 163, '弱男モンスター', {
      fontSize: '72px',
      fontFamily: FONT_FAMILY,
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0.3);

    const title = this.add.text(GAME_WIDTH / 2, 160, '弱男モンスター', {
      fontSize: '72px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MAIN_PINK,
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // サブタイトル
    this.add.text(GAME_WIDTH / 2, 240, '〜 色恋営業バトル 〜', {
      fontSize: '28px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.ACCENT_GOLD,
    }).setOrigin(0.5);

    // 略称
    this.add.text(GAME_WIDTH / 2, 290, '- 弱モン -', {
      fontSize: '24px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.SUB_LAVENDER,
    }).setOrigin(0.5);

    // アイドルプレビュー（小さく5人並べる）
    for (let i = 0; i < 5; i++) {
      const x = GAME_WIDTH / 2 - 200 + i * 100;
      const img = this.add.image(x, 420, `idol_${i}`).setScale(0.5);
      this.tweens.add({
        targets: img,
        y: 415,
        duration: 1500 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // スタートボタン
    const startBtn = this.add.image(GAME_WIDTH / 2, 560, 'btn_pink').setInteractive({ useHandCursor: true });
    const startText = this.add.text(GAME_WIDTH / 2, 560, 'ゲームスタート', {
      fontSize: '24px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    startBtn.on('pointerover', () => startBtn.setTint(0xFFAACC));
    startBtn.on('pointerout', () => startBtn.clearTint());
    startBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('IdolSelectScene');
      });
    });

    // 点滅テキスト
    const tapText = this.add.text(GAME_WIDTH / 2, 640, '▼ タップしてスタート ▼', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.TEXT_WHITE,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: tapText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // タイトルアニメーション
    this.tweens.add({
      targets: [title, titleShadow],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.cameras.main.fadeIn(500);
  }

  update(): void {
    this.gfx.clear();
    this.drawBackground();

    // ハートパーティクル更新・描画
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -20) {
        p.y = GAME_HEIGHT + 20;
        p.x = Math.random() * GAME_WIDTH;
      }
      this.gfx.fillStyle(0xFF69B4, p.alpha);
      // 簡易ハート描画（小さいので丸で代替）
      this.gfx.fillCircle(p.x, p.y, p.size);
    });
  }

  private drawBackground(): void {
    // グラデーション背景
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      const ratio = y / GAME_HEIGHT;
      const r = Math.floor(0x1a + (0x2e - 0x1a) * ratio);
      const g = Math.floor(0x0a * (1 - ratio));
      const b = Math.floor(0x2e + (0x5e - 0x2e) * ratio);
      this.gfx.fillStyle((r << 16) | (g << 8) | b, 1);
      this.gfx.fillRect(0, y, GAME_WIDTH, 4);
    }
  }
}
