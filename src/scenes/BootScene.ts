// BootScene - アセットプリロード & テクスチャ生成
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS } from '../utils/constants';
import { IdolGenerator } from '../characters/IdolGenerator';
import { OtakuGenerator } from '../characters/OtakuGenerator';
import { IDOL_LIST } from '../characters/IdolData';
import { OtakuType } from '../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create(): void {
    // ローディングテキスト
    const loadText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ロード中...', {
      fontSize: '32px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.TEXT_WHITE,
    }).setOrigin(0.5);

    // アイドルテクスチャ生成
    IDOL_LIST.forEach((idol, i) => {
      IdolGenerator.generate(this, idol, `idol_${i}`, 200);
      IdolGenerator.generate(this, idol, `idol_${i}_large`, 300);
    });

    // ヲタクテクスチャ生成（各タイプ × 各表情）
    const types = Object.values(OtakuType);
    const expressions = ['normal', 'blush', 'sparkle', 'heart', 'ascend'] as const;
    types.forEach((type, ti) => {
      expressions.forEach(expr => {
        OtakuGenerator.generate(this, `otaku_${ti}_${expr}`, type, expr, 200);
      });
    });

    // ボタンテクスチャ生成
    this.createButtonTexture('btn_pink', 250, 60, '#FF69B4');
    this.createButtonTexture('btn_gold', 250, 60, '#FFD700');
    this.createButtonTexture('btn_purple', 250, 60, '#9B59B6');
    this.createButtonTexture('btn_red', 250, 60, '#FF4444');
    this.createButtonTexture('btn_blue', 250, 60, '#4488FF');
    this.createButtonTexture('btn_small', 140, 50, '#FF69B4');
    this.createButtonTexture('btn_action', 280, 70, '#FF69B4');
    this.createButtonTexture('btn_skill', 280, 55, '#5B8DBE');

    loadText.destroy();

    this.scene.start('TitleScene');
  }

  private createButtonTexture(key: string, w: number, h: number, color: string): void {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 角丸四角形
    const radius = 12;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.arcTo(w, 0, w, radius, radius);
    ctx.lineTo(w, h - radius);
    ctx.arcTo(w, h, w - radius, h, radius);
    ctx.lineTo(radius, h);
    ctx.arcTo(0, h, 0, h - radius, radius);
    ctx.lineTo(0, radius);
    ctx.arcTo(0, 0, radius, 0, radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // ハイライト
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.arcTo(w, 0, w, radius, radius);
    ctx.lineTo(w, h / 2);
    ctx.lineTo(0, h / 2);
    ctx.lineTo(0, radius);
    ctx.arcTo(0, 0, radius, 0, radius);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();

    // 枠線
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.arcTo(w, 0, w, radius, radius);
    ctx.lineTo(w, h - radius);
    ctx.arcTo(w, h, w - radius, h, radius);
    ctx.lineTo(radius, h);
    ctx.arcTo(0, h, 0, h - radius, radius);
    ctx.lineTo(0, radius);
    ctx.arcTo(0, 0, radius, 0, radius);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    this.textures.addCanvas(key, canvas);
  }
}
