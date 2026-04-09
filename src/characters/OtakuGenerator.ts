// ヲタクキャラ生成（Canvas描画）- パワパフ風の顔
import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';
import { OtakuType } from '../utils/constants';

export type OtakuExpression = 'normal' | 'blush' | 'sparkle' | 'heart' | 'ascend';

export class OtakuGenerator {
  static generate(
    scene: Phaser.Scene,
    key: string,
    type: OtakuType,
    expression: OtakuExpression = 'normal',
    size: number = 200
  ): void {
    SpriteGenerator.generateTexture(scene, key, size, size, (ctx, w, _h) => {
      this.drawOtaku(ctx, w, type, expression);
    });
  }

  private static drawOtaku(
    ctx: CanvasRenderingContext2D,
    w: number,
    type: OtakuType,
    expression: OtakuExpression
  ): void {
    const cx = w / 2;
    const s = w / 200;

    // 後光（昇天時）
    if (expression === 'ascend') {
      this.drawHalo(ctx, cx, 25 * s, s);
    }

    // 体
    this.drawBody(ctx, cx, 130 * s, type, s);

    // 顔の黒アウトライン（パワパフ風）
    SpriteGenerator.drawCircle(ctx, cx, 60 * s, 34 * s, '#000000');
    // 顔本体
    SpriteGenerator.drawCircle(ctx, cx, 60 * s, 31 * s, '#F5DEB3');

    // 髪
    this.drawHair(ctx, cx, 30 * s, type, s);

    // メガネ（目の上に描画するので先に）
    // 目（パワパフ風の巨大目）
    this.drawPowerpuffEyes(ctx, cx, 58 * s, expression, s);

    // メガネ（目の上に描画）
    this.drawGlasses(ctx, cx, 58 * s, type, s);

    // 口
    this.drawMouthByExpression(ctx, cx, 78 * s, expression, s);

    // 頬（赤面時）
    if (expression === 'blush' || expression === 'sparkle' || expression === 'heart') {
      SpriteGenerator.drawEllipse(ctx, cx - 24 * s, 70 * s, 7 * s, 4 * s, 'rgba(255,100,100,0.6)');
      SpriteGenerator.drawEllipse(ctx, cx + 24 * s, 70 * s, 7 * s, 4 * s, 'rgba(255,100,100,0.6)');
    }

    // キラキラ（sparkle時）
    if (expression === 'sparkle') {
      this.drawSparkles(ctx, cx, 40 * s, s);
    }

    // ハートパーティクル（heart時）
    if (expression === 'heart') {
      this.drawHeartParticles(ctx, cx, 40 * s, s);
    }

    // ペンライト
    this.drawPenlight(ctx, cx + 35 * s, 140 * s, s);
  }

  /** パワパフ風の巨大な目 */
  private static drawPowerpuffEyes(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expression: OtakuExpression,
    s: number
  ): void {
    const eyeOffsetX = 12 * s;
    [-1, 1].forEach(dir => {
      const ex = cx + eyeOffsetX * dir;

      if (expression === 'heart') {
        // ハート目 - パワパフ風に大きく
        // 黒アウトライン
        ctx.beginPath();
        ctx.ellipse(ex, cy, 14 * s, 16 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        // ハート
        SpriteGenerator.drawHeart(ctx, ex, cy - 6 * s, 18 * s, '#FF1493');
      } else if (expression === 'ascend') {
        // 白目（昇天）- パワパフ風に大きく
        ctx.beginPath();
        ctx.ellipse(ex, cy, 14 * s, 16 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex, cy, 12 * s, 14 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        // うずまき
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = 2 * s;
        ctx.beginPath();
        ctx.arc(ex, cy, 4 * s, 0, Math.PI * 3, false);
        ctx.stroke();
      } else {
        // 通常（パワパフ風巨大目）
        // 黒アウトライン
        ctx.beginPath();
        ctx.ellipse(ex, cy, 14 * s, 16 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        // 白目
        ctx.beginPath();
        ctx.ellipse(ex, cy, 12 * s, 14 * s, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        // 瞳（大きめの黒丸）
        SpriteGenerator.drawCircle(ctx, ex + 2 * s * dir, cy + 1 * s, 7 * s, '#333333');
        // ハイライト
        SpriteGenerator.drawCircle(ctx, ex, cy - 4 * s, 3.5 * s, 'rgba(255,255,255,0.9)');
        SpriteGenerator.drawCircle(ctx, ex + 3 * s * dir, cy + 3 * s, 1.5 * s, 'rgba(255,255,255,0.7)');
      }
    });
  }

  private static drawMouthByExpression(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expression: OtakuExpression,
    s: number
  ): void {
    if (expression === 'normal') {
      // 小さめ横線（パワパフ風）
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 2 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - 5 * s, cy);
      ctx.lineTo(cx + 5 * s, cy);
      ctx.stroke();
    } else if (expression === 'ascend') {
      // 大きく開いた口（昇天）
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2 * s, 8 * s, 10 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2 * s, 6 * s, 8 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#8B4513';
      ctx.fill();
    } else {
      // にやけ（パワパフ風にシンプルな弧）
      ctx.strokeStyle = '#555555';
      ctx.lineWidth = 2 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy - 4 * s, 7 * s, 0.1 * Math.PI, 0.9 * Math.PI, false);
      ctx.stroke();
    }
  }

  private static drawGlasses(ctx: CanvasRenderingContext2D, cx: number, cy: number, type: OtakuType, s: number): void {
    if (type === OtakuType.YAKKAI) {
      // サングラス（パワパフ風の目の上に重ねる）
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.beginPath();
      ctx.ellipse(cx - 12 * s, cy, 16 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 12 * s, cy, 16 * s, 14 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(cx - 2 * s, cy - 2 * s);
      ctx.lineTo(cx + 2 * s, cy - 2 * s);
      ctx.stroke();
    } else {
      // 黒縁メガネ（大きめのパワパフ目に合わせてサイズ調整）
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2.5 * s;
      [-1, 1].forEach(dir => {
        ctx.beginPath();
        ctx.ellipse(cx + 12 * s * dir, cy, 16 * s, 15 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      // ブリッジ
      ctx.beginPath();
      ctx.moveTo(cx - 4 * s, cy - 3 * s);
      ctx.quadraticCurveTo(cx, cy - 6 * s, cx + 4 * s, cy - 3 * s);
      ctx.stroke();
      // テンプル（つる）
      [-1, 1].forEach(dir => {
        ctx.beginPath();
        ctx.moveTo(cx + 28 * s * dir, cy);
        ctx.lineTo(cx + 32 * s * dir, cy - 5 * s);
        ctx.stroke();
      });
    }
  }

  private static drawHair(ctx: CanvasRenderingContext2D, cx: number, topY: number, type: OtakuType, s: number): void {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * s;
    switch (type) {
      case OtakuType.JIRAI: {
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.moveTo(cx - 33 * s, topY + 28 * s);
        ctx.quadraticCurveTo(cx - 35 * s, topY - 10 * s, cx, topY - 15 * s);
        ctx.quadraticCurveTo(cx + 35 * s, topY - 10 * s, cx + 33 * s, topY + 28 * s);
        ctx.lineTo(cx + 30 * s, topY + 38 * s);
        ctx.quadraticCurveTo(cx, topY + 33 * s, cx - 30 * s, topY + 38 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      case OtakuType.KOSAN: {
        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.moveTo(cx - 28 * s, topY + 22 * s);
        ctx.quadraticCurveTo(cx - 30 * s, topY, cx, topY - 5 * s);
        ctx.quadraticCurveTo(cx + 30 * s, topY, cx + 28 * s, topY + 22 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      default: {
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.moveTo(cx - 33 * s, topY + 22 * s);
        ctx.quadraticCurveTo(cx - 36 * s, topY - 8 * s, cx, topY - 12 * s);
        ctx.quadraticCurveTo(cx + 36 * s, topY - 8 * s, cx + 33 * s, topY + 22 * s);
        for (let i = 6; i >= 0; i--) {
          const x = cx - 33 * s + (66 * s / 6) * i;
          const y = topY + (i % 2 === 0 ? 30 : 24) * s;
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
    }
  }

  private static drawBody(ctx: CanvasRenderingContext2D, cx: number, cy: number, type: OtakuType, s: number): void {
    const bodyWidth = type === OtakuType.KOSAN ? 38 * s : 30 * s;

    ctx.beginPath();
    ctx.moveTo(cx - bodyWidth, cy - 10 * s);
    ctx.quadraticCurveTo(cx - bodyWidth - 5 * s, cy + 50 * s, cx - bodyWidth + 5 * s, cy + 65 * s);
    ctx.lineTo(cx + bodyWidth - 5 * s, cy + 65 * s);
    ctx.quadraticCurveTo(cx + bodyWidth + 5 * s, cy + 50 * s, cx + bodyWidth, cy - 10 * s);
    ctx.closePath();

    if (type === OtakuType.SHINKI) {
      ctx.fillStyle = '#5B8DBE'; ctx.fill();
    } else if (type === OtakuType.JIRAI) {
      ctx.fillStyle = '#1a1a1a'; ctx.fill();
    } else {
      ctx.fillStyle = '#CC4444'; ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1 * s;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 10 * s, cy - 10 * s); ctx.lineTo(cx + i * 10 * s, cy + 65 * s); ctx.stroke(); }
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(cx - bodyWidth, cy + i * 10 * s); ctx.lineTo(cx + bodyWidth, cy + i * 10 * s); ctx.stroke(); }
    }

    // 首
    SpriteGenerator.drawEllipse(ctx, cx, cy - 13 * s, 8 * s, 10 * s, '#F5DEB3');

    // リュック
    if (type === OtakuType.KOSAN || type === OtakuType.RYOSAN) {
      ctx.fillStyle = '#2C5F2D';
      ctx.fillRect(cx + bodyWidth - 5 * s, cy - 5 * s, 15 * s, 40 * s);
    }
  }

  private static drawPenlight(ctx: CanvasRenderingContext2D, x: number, y: number, s: number): void {
    ctx.fillStyle = '#888888';
    ctx.fillRect(x - 2 * s, y - 15 * s, 4 * s, 20 * s);
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath(); ctx.arc(x, y - 18 * s, 5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,105,180,0.3)';
    ctx.beginPath(); ctx.arc(x, y - 18 * s, 10 * s, 0, Math.PI * 2); ctx.fill();
  }

  private static drawHalo(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
    ctx.strokeStyle = 'rgba(255,215,0,0.5)'; ctx.lineWidth = 2 * s;
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 40 * s, cy + Math.sin(angle) * 40 * s);
      ctx.lineTo(cx + Math.cos(angle) * 90 * s, cy + Math.sin(angle) * 90 * s);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255,215,0,0.8)'; ctx.lineWidth = 3 * s;
    ctx.beginPath(); ctx.ellipse(cx, cy - 10 * s, 25 * s, 8 * s, 0, 0, Math.PI * 2); ctx.stroke();
  }

  private static drawSparkles(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
    [{ x: cx - 40 * s, y: cy - 10 * s }, { x: cx + 40 * s, y: cy }, { x: cx - 30 * s, y: cy + 30 * s }, { x: cx + 35 * s, y: cy + 25 * s }, { x: cx, y: cy - 25 * s }].forEach(p => {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(p.x - 1 * s, p.y - 4 * s, 2 * s, 8 * s);
      ctx.fillRect(p.x - 4 * s, p.y - 1 * s, 8 * s, 2 * s);
    });
  }

  private static drawHeartParticles(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
    [{ x: cx - 35 * s, y: cy - 15 * s, size: 10 * s }, { x: cx + 38 * s, y: cy - 5 * s, size: 8 * s }, { x: cx - 25 * s, y: cy + 20 * s, size: 12 * s }, { x: cx + 30 * s, y: cy + 25 * s, size: 9 * s }, { x: cx + 5 * s, y: cy - 30 * s, size: 11 * s }].forEach(p => {
      SpriteGenerator.drawHeart(ctx, p.x, p.y, p.size, '#FF1493');
    });
  }
}
