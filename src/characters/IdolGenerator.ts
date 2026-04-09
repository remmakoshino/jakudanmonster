// アイドルキャラ生成（Canvas描画）- パワパフ風の顔 + アイカツ風の衣装
import Phaser from 'phaser';
import { SpriteGenerator } from '../utils/SpriteGenerator';
import { IdolData } from './IdolData';

export class IdolGenerator {
  static generate(scene: Phaser.Scene, idol: IdolData, key: string, size: number = 200): void {
    SpriteGenerator.generateTexture(scene, key, size, size, (ctx, w, _h) => {
      this.drawIdol(ctx, w, idol);
    });
  }

  private static drawIdol(ctx: CanvasRenderingContext2D, w: number, idol: IdolData): void {
    const cx = w / 2;
    const s = w / 200;

    // 後ろ髪
    this.drawBackHair(ctx, cx, 45 * s, idol, s);

    // 体（アイカツ風衣装）
    this.drawBody(ctx, cx, 105 * s, idol, s);

    // 脚
    this.drawLegs(ctx, cx, 155 * s, idol, s);

    // 顔の黒アウトライン（パワパフ風）
    SpriteGenerator.drawCircle(ctx, cx, 50 * s, 36 * s, '#000000');
    // 顔本体
    SpriteGenerator.drawCircle(ctx, cx, 50 * s, 33 * s, '#FFE0BD');

    // 目（パワパフ風巨大目）
    this.drawPowerpuffEyes(ctx, cx, 50 * s, idol, s);

    // 口（小さくシンプル）
    this.drawPowerpuffMouth(ctx, cx, 65 * s, s);

    // 頬紅
    SpriteGenerator.drawEllipse(ctx, cx - 30 * s, 60 * s, 7 * s, 4 * s, 'rgba(255,120,140,0.5)');
    SpriteGenerator.drawEllipse(ctx, cx + 30 * s, 60 * s, 7 * s, 4 * s, 'rgba(255,120,140,0.5)');

    // 前髪
    this.drawFrontHair(ctx, cx, 20 * s, idol, s);

    // 髪飾り
    this.drawRibbonAccessory(ctx, cx, idol, s);
  }

  private static drawPowerpuffEyes(ctx: CanvasRenderingContext2D, cx: number, cy: number, idol: IdolData, s: number): void {
    const eyeOffsetX = 18 * s;
    const eyeY = cy - 2 * s;

    [-1, 1].forEach(dir => {
      const ex = cx + eyeOffsetX * dir;

      // 目の黒アウトライン（太い）
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 15 * s, 17 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // 白目（大きい）
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 13 * s, 15 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // 虹彩（キャラカラー）
      const grad = ctx.createRadialGradient(ex + 2 * s * dir, eyeY + 1 * s, 1 * s, ex + 2 * s * dir, eyeY + 1 * s, 10 * s);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, idol.hairColor);
      grad.addColorStop(1, idol.hairColor);
      ctx.beginPath();
      ctx.ellipse(ex + 2 * s * dir, eyeY + 1 * s, 9 * s, 11 * s, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // 瞳孔
      SpriteGenerator.drawCircle(ctx, ex + 2 * s * dir, eyeY + 2 * s, 5 * s, '#111111');

      // ハイライト（大2つ）
      SpriteGenerator.drawCircle(ctx, ex - 1 * s, eyeY - 5 * s, 4 * s, 'rgba(255,255,255,0.95)');
      SpriteGenerator.drawCircle(ctx, ex + 4 * s * dir, eyeY + 3 * s, 2 * s, 'rgba(255,255,255,0.8)');

      // まつげ（太め3本、パワパフ風）
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5 * s;
      ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) {
        const angle = -0.8 + i * 0.4;
        const startR = 15 * s;
        const endR = 21 * s;
        ctx.beginPath();
        ctx.moveTo(ex + Math.cos(angle) * startR * dir, eyeY - Math.sin(angle) * startR);
        ctx.lineTo(ex + Math.cos(angle) * endR * dir, eyeY - Math.sin(angle) * endR);
        ctx.stroke();
      }
    });
  }

  private static drawPowerpuffMouth(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number): void {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy - 3 * s, 6 * s, 0.15 * Math.PI, 0.85 * Math.PI, false);
    ctx.stroke();
    // 舌
    ctx.fillStyle = '#E87070';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 1 * s, 3 * s, 2 * s, 0, 0, Math.PI);
    ctx.fill();
  }

  private static drawBody(ctx: CanvasRenderingContext2D, cx: number, cy: number, idol: IdolData, s: number): void {
    // 首
    SpriteGenerator.drawEllipse(ctx, cx, cy - 18 * s, 6 * s, 10 * s, '#FFE0BD');

    // 上半身（トップス）
    ctx.beginPath();
    ctx.moveTo(cx - 22 * s, cy - 10 * s);
    ctx.quadraticCurveTo(cx - 24 * s, cy + 5 * s, cx - 20 * s, cy + 15 * s);
    ctx.lineTo(cx + 20 * s, cy + 15 * s);
    ctx.quadraticCurveTo(cx + 24 * s, cy + 5 * s, cx + 22 * s, cy - 10 * s);
    ctx.closePath();
    ctx.fillStyle = idol.hairColor;
    ctx.fill();
    // 光沢
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.moveTo(cx - 18 * s, cy - 10 * s);
    ctx.quadraticCurveTo(cx, cy - 5 * s, cx + 18 * s, cy - 10 * s);
    ctx.lineTo(cx + 15 * s, cy);
    ctx.quadraticCurveTo(cx, cy + 2 * s, cx - 15 * s, cy);
    ctx.closePath();
    ctx.fill();

    // ジュエル（胸元）
    SpriteGenerator.drawCircle(ctx, cx, cy - 5 * s, 4 * s, '#FFFFFF');
    SpriteGenerator.drawCircle(ctx, cx, cy - 5 * s, 3 * s, idol.hairColor);
    SpriteGenerator.drawCircle(ctx, cx - 1 * s, cy - 7 * s, 1.5 * s, 'rgba(255,255,255,0.9)');

    // スカート本体
    const skirtTop = cy + 15 * s;
    const skirtBottom = cy + 52 * s;
    ctx.beginPath();
    ctx.moveTo(cx - 20 * s, skirtTop);
    ctx.quadraticCurveTo(cx - 35 * s, skirtBottom, cx - 30 * s, skirtBottom);
    ctx.lineTo(cx + 30 * s, skirtBottom);
    ctx.quadraticCurveTo(cx + 35 * s, skirtBottom, cx + 20 * s, skirtTop);
    ctx.closePath();
    ctx.fillStyle = idol.hairColor;
    ctx.fill();

    // 3段フリル
    for (let layer = 0; layer < 3; layer++) {
      const frillY = skirtTop + (skirtBottom - skirtTop) * ((layer + 1) / 3.5);
      const frillWidth = 22 * s + layer * 5 * s;
      const color = layer % 2 === 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)';
      for (let i = -4; i <= 4; i++) {
        const fx = cx + i * (frillWidth / 4);
        SpriteGenerator.drawEllipse(ctx, fx, frillY, 5 * s, 3 * s, color);
      }
    }

    // スカート裾レース
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1 * s;
    for (let i = -5; i <= 5; i++) {
      const sx = cx + i * 6 * s;
      ctx.beginPath();
      ctx.arc(sx, skirtBottom - 2 * s, 3 * s, 0, Math.PI, false);
      ctx.stroke();
    }

    // 肩ファー
    [-1, 1].forEach(dir => {
      for (let i = 0; i < 4; i++) {
        const angle = -0.5 + i * 0.35;
        const fx = cx + (20 + Math.cos(angle) * 8) * s * dir;
        const fy = cy - 8 * s + Math.sin(angle) * 6 * s;
        SpriteGenerator.drawEllipse(ctx, fx, fy, 5 * s, 4 * s, '#FFFFFF');
      }
    });

    // 腰リボン
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.moveTo(cx, skirtTop + 2 * s); ctx.lineTo(cx - 15 * s, skirtTop - 3 * s); ctx.lineTo(cx - 3 * s, skirtTop + 2 * s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, skirtTop + 2 * s); ctx.lineTo(cx + 15 * s, skirtTop - 3 * s); ctx.lineTo(cx + 3 * s, skirtTop + 2 * s); ctx.closePath(); ctx.fill();
    SpriteGenerator.drawCircle(ctx, cx, skirtTop + 2 * s, 3 * s, '#FFD700');

    // 腕
    [-1, 1].forEach(dir => {
      ctx.strokeStyle = '#FFE0BD';
      ctx.lineWidth = 7 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + 22 * s * dir, cy - 5 * s);
      ctx.lineTo(cx + 30 * s * dir, cy + 20 * s);
      ctx.stroke();
      SpriteGenerator.drawCircle(ctx, cx + 30 * s * dir, cy + 22 * s, 5 * s, '#FFE0BD');
      // ブレスレット
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.ellipse(cx + 29 * s * dir, cy + 16 * s, 4 * s, 2 * s, 0.3 * dir, 0, Math.PI * 2);
      ctx.stroke();
    });

    // キラキラエフェクト
    [{ x: cx - 18 * s, y: cy + 25 * s }, { x: cx + 15 * s, y: cy + 35 * s }, { x: cx - 10 * s, y: cy + 45 * s }, { x: cx + 22 * s, y: cy + 10 * s }].forEach(p => {
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(p.x - 1 * s, p.y - 3 * s, 2 * s, 6 * s);
      ctx.fillRect(p.x - 3 * s, p.y - 1 * s, 6 * s, 2 * s);
    });
  }

  private static drawLegs(ctx: CanvasRenderingContext2D, cx: number, cy: number, idol: IdolData, s: number): void {
    [-1, 1].forEach(dir => {
      const lx = cx + 8 * s * dir;
      ctx.strokeStyle = '#FFE0BD';
      ctx.lineWidth = 6 * s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lx, cy);
      ctx.lineTo(lx + 2 * s * dir, cy + 30 * s);
      ctx.stroke();
      // ブーツ
      ctx.fillStyle = idol.hairColor;
      ctx.beginPath();
      ctx.moveTo(lx - 5 * s, cy + 25 * s); ctx.lineTo(lx - 6 * s, cy + 38 * s); ctx.lineTo(lx + 6 * s, cy + 38 * s); ctx.lineTo(lx + 5 * s, cy + 25 * s);
      ctx.closePath(); ctx.fill();
      for (let i = -1; i <= 1; i++) SpriteGenerator.drawEllipse(ctx, lx + i * 4 * s, cy + 25 * s, 3 * s, 2 * s, '#FFFFFF');
      ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 1.5 * s;
      ctx.beginPath(); ctx.ellipse(lx, cy + 26 * s, 5 * s, 2 * s, 0, 0, Math.PI * 2); ctx.stroke();
    });
  }

  private static drawFrontHair(ctx: CanvasRenderingContext2D, cx: number, topY: number, idol: IdolData, s: number): void {
    ctx.fillStyle = idol.hairColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5 * s;

    // 頭頂部のボリューム（共通）
    ctx.beginPath();
    ctx.moveTo(cx - 37 * s, topY + 12 * s);
    ctx.quadraticCurveTo(cx - 40 * s, topY - 10 * s, cx, topY - 16 * s);
    ctx.quadraticCurveTo(cx + 40 * s, topY - 10 * s, cx + 37 * s, topY + 12 * s);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 前髪（目の上で止まる短い束 + 躍動感のある流れ）
    const bangTips: { x: number; y: number }[] = [];
    switch (idol.hairStyle) {
      case 'twintail': {
        // ぱっつん前髪（短め、眉上でカット + 左右に流れる毛束）
        const bangs = [
          { x: cx - 32 * s, y: topY + 18 * s },
          { x: cx - 20 * s, y: topY + 15 * s },
          { x: cx - 8 * s, y: topY + 18 * s },
          { x: cx + 5 * s, y: topY + 15 * s },
          { x: cx + 18 * s, y: topY + 18 * s },
          { x: cx + 30 * s, y: topY + 15 * s },
        ];
        bangTips.push(...bangs);
        // 左右にはねる毛束
        [-1, 1].forEach(dir => {
          ctx.beginPath();
          ctx.moveTo(cx + 35 * s * dir, topY + 12 * s);
          ctx.quadraticCurveTo(cx + 44 * s * dir, topY + 20 * s, cx + 42 * s * dir, topY + 30 * s);
          ctx.quadraticCurveTo(cx + 46 * s * dir, topY + 22 * s, cx + 38 * s * dir, topY + 10 * s);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        });
        break;
      }
      case 'longstraight': {
        // ストレート前髪（整った斜め分け + サイド流し）
        bangTips.push(
          { x: cx - 34 * s, y: topY + 20 * s },
          { x: cx - 22 * s, y: topY + 16 * s },
          { x: cx - 10 * s, y: topY + 14 * s },
          { x: cx + 3 * s, y: topY + 13 * s },
          { x: cx + 16 * s, y: topY + 15 * s },
          { x: cx + 28 * s, y: topY + 18 * s },
        );
        // 風になびくサイドの毛束
        ctx.beginPath();
        ctx.moveTo(cx - 36 * s, topY + 14 * s);
        ctx.quadraticCurveTo(cx - 46 * s, topY + 28 * s, cx - 40 * s, topY + 38 * s);
        ctx.quadraticCurveTo(cx - 44 * s, topY + 26 * s, cx - 38 * s, topY + 12 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      case 'ponytail': {
        // サイドに流した前髪（左に長めの束）
        bangTips.push(
          { x: cx - 30 * s, y: topY + 22 * s },
          { x: cx - 18 * s, y: topY + 18 * s },
          { x: cx - 6 * s, y: topY + 15 * s },
          { x: cx + 8 * s, y: topY + 14 * s },
          { x: cx + 20 * s, y: topY + 16 * s },
          { x: cx + 32 * s, y: topY + 14 * s },
        );
        // 左に躍動感のある長い毛束
        ctx.beginPath();
        ctx.moveTo(cx - 34 * s, topY + 16 * s);
        ctx.quadraticCurveTo(cx - 48 * s, topY + 32 * s, cx - 44 * s, topY + 45 * s);
        ctx.lineTo(cx - 40 * s, topY + 42 * s);
        ctx.quadraticCurveTo(cx - 44 * s, topY + 28 * s, cx - 32 * s, topY + 14 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      case 'shortbob': {
        // ふんわりボブ前髪（丸みのある短い束）
        bangTips.push(
          { x: cx - 30 * s, y: topY + 17 * s },
          { x: cx - 18 * s, y: topY + 20 * s },
          { x: cx - 6 * s, y: topY + 18 * s },
          { x: cx + 6 * s, y: topY + 20 * s },
          { x: cx + 18 * s, y: topY + 17 * s },
          { x: cx + 30 * s, y: topY + 19 * s },
        );
        // 外ハネする毛先
        [-1, 1].forEach(dir => {
          ctx.beginPath();
          ctx.moveTo(cx + 34 * s * dir, topY + 12 * s);
          ctx.quadraticCurveTo(cx + 42 * s * dir, topY + 18 * s, cx + 46 * s * dir, topY + 16 * s);
          ctx.quadraticCurveTo(cx + 44 * s * dir, topY + 22 * s, cx + 36 * s * dir, topY + 14 * s);
          ctx.closePath();
          ctx.fill(); ctx.stroke();
        });
        break;
      }
      case 'asymmetry': {
        // アシンメトリー（右が短く左が長め + 躍動的な流れ）
        bangTips.push(
          { x: cx - 32 * s, y: topY + 22 * s },
          { x: cx - 20 * s, y: topY + 20 * s },
          { x: cx - 8 * s, y: topY + 17 * s },
          { x: cx + 5 * s, y: topY + 14 * s },
          { x: cx + 18 * s, y: topY + 13 * s },
          { x: cx + 30 * s, y: topY + 15 * s },
        );
        // 左に流れるボリュームのある毛束
        ctx.beginPath();
        ctx.moveTo(cx - 35 * s, topY + 16 * s);
        ctx.quadraticCurveTo(cx - 50 * s, topY + 30 * s, cx - 46 * s, topY + 44 * s);
        ctx.lineTo(cx - 42 * s, topY + 40 * s);
        ctx.quadraticCurveTo(cx - 46 * s, topY + 26 * s, cx - 33 * s, topY + 14 * s);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        break;
      }
      default: {
        bangTips.push(
          { x: cx - 30 * s, y: topY + 18 * s },
          { x: cx - 16 * s, y: topY + 16 * s },
          { x: cx - 2 * s, y: topY + 18 * s },
          { x: cx + 12 * s, y: topY + 16 * s },
          { x: cx + 26 * s, y: topY + 18 * s },
        );
        break;
      }
    }

    // 前髪を個別の毛束として描画（束感 + 隙間でリアリティ）
    if (bangTips.length > 0) {
      const topCurveY = topY - 4 * s;

      for (let i = 0; i < bangTips.length; i++) {
        const tip = bangTips[i];
        // 各毛束の幅（隣との間に隙間を作る）
        const strandW = 5 * s;
        // 毛束の根元（頭頂カーブ上の位置）
        const t = (tip.x - (cx - 37 * s)) / (74 * s);
        const rootY = topCurveY + Math.sin(t * Math.PI) * (-8 * s);

        ctx.fillStyle = idol.hairColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5 * s;
        ctx.beginPath();
        ctx.moveTo(tip.x - strandW, rootY);
        ctx.quadraticCurveTo(tip.x - strandW * 0.8, (rootY + tip.y) / 2, tip.x - 1 * s, tip.y);
        ctx.lineTo(tip.x + 1 * s, tip.y);
        ctx.quadraticCurveTo(tip.x + strandW * 0.8, (rootY + tip.y) / 2, tip.x + strandW, rootY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 毛束ごとのツヤライン
        ctx.strokeStyle = 'rgba(255,255,255,0.25)';
        ctx.lineWidth = 1 * s;
        ctx.beginPath();
        ctx.moveTo(tip.x - 1 * s, rootY + 3 * s);
        ctx.quadraticCurveTo(tip.x, (rootY + tip.y) / 2 - 2 * s, tip.x + 1 * s, tip.y - 3 * s);
        ctx.stroke();
      }
    }
  }

  private static drawBackHair(ctx: CanvasRenderingContext2D, cx: number, topY: number, idol: IdolData, s: number): void {
    ctx.fillStyle = idol.hairColor;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2 * s;
    switch (idol.hairStyle) {
      case 'twintail':
        // ツインテール（S字カーブで躍動感）
        [{ tx: cx - 38 * s, dir: -1 }, { tx: cx + 38 * s, dir: 1 }].forEach(({ tx, dir }) => {
          ctx.beginPath();
          ctx.moveTo(tx - 8 * s, topY);
          ctx.bezierCurveTo(
            tx - 22 * s * dir, topY + 30 * s,
            tx + 18 * s * dir, topY + 70 * s,
            tx - 10 * s * dir, topY + 130 * s
          );
          ctx.quadraticCurveTo(tx, topY + 142 * s, tx + 10 * s * dir, topY + 125 * s);
          ctx.bezierCurveTo(
            tx + 16 * s * dir, topY + 65 * s,
            tx - 14 * s * dir, topY + 35 * s,
            tx + 8 * s, topY
          );
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // 毛先のはね
          ctx.beginPath();
          ctx.moveTo(tx - 10 * s * dir, topY + 125 * s);
          ctx.quadraticCurveTo(tx - 18 * s * dir, topY + 138 * s, tx - 14 * s * dir, topY + 145 * s);
          ctx.stroke();
          SpriteGenerator.drawCircle(ctx, tx, topY + 5 * s, 5 * s, '#FFD700');
          // ツヤ
          ctx.strokeStyle = 'rgba(255,255,255,0.25)';
          ctx.lineWidth = 2 * s;
          ctx.beginPath();
          ctx.moveTo(tx - 2 * s, topY + 40 * s);
          ctx.quadraticCurveTo(tx + 6 * s * dir, topY + 60 * s, tx - 4 * s, topY + 80 * s);
          ctx.stroke();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2 * s;
        });
        break;
      case 'longstraight':
        // ロングストレート（風になびく波打ちライン）
        ctx.beginPath();
        ctx.moveTo(cx - 40 * s, topY - 10 * s);
        ctx.bezierCurveTo(cx - 44 * s, topY + 40 * s, cx - 40 * s, topY + 90 * s, cx - 38 * s, topY + 140 * s);
        ctx.quadraticCurveTo(cx, topY + 152 * s, cx + 38 * s, topY + 140 * s);
        ctx.bezierCurveTo(cx + 40 * s, topY + 90 * s, cx + 44 * s, topY + 40 * s, cx + 40 * s, topY - 10 * s);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 毛先の揺れ
        for (let i = -3; i <= 3; i++) {
          const x = cx + i * 11 * s;
          ctx.beginPath();
          ctx.moveTo(x, topY + 138 * s);
          ctx.quadraticCurveTo(x + 4 * s, topY + 148 * s, x - 2 * s, topY + 155 * s);
          ctx.stroke();
        }
        // ツヤライン
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 3 * s;
        ctx.beginPath();
        ctx.moveTo(cx - 25 * s, topY + 30 * s);
        ctx.quadraticCurveTo(cx, topY + 25 * s, cx + 20 * s, topY + 35 * s);
        ctx.stroke();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 * s;
        break;
      case 'ponytail':
        // ポニーテール（弾むような曲線 + 毛先はね）
        ctx.beginPath();
        ctx.moveTo(cx + 12 * s, topY - 5 * s);
        ctx.bezierCurveTo(
          cx + 60 * s, topY + 5 * s,
          cx + 50 * s, topY + 55 * s,
          cx + 55 * s, topY + 90 * s
        );
        ctx.quadraticCurveTo(cx + 58 * s, topY + 110 * s, cx + 48 * s, topY + 120 * s);
        ctx.quadraticCurveTo(cx + 35 * s, topY + 128 * s, cx + 25 * s, topY + 110 * s);
        ctx.bezierCurveTo(
          cx + 28 * s, topY + 55 * s,
          cx + 35 * s, topY + 15 * s,
          cx + 8 * s, topY
        );
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 毛先のはね
        ctx.beginPath();
        ctx.moveTo(cx + 48 * s, topY + 115 * s);
        ctx.quadraticCurveTo(cx + 56 * s, topY + 125 * s, cx + 52 * s, topY + 135 * s);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 38 * s, topY + 118 * s);
        ctx.quadraticCurveTo(cx + 44 * s, topY + 130 * s, cx + 38 * s, topY + 138 * s);
        ctx.stroke();
        SpriteGenerator.drawCircle(ctx, cx + 15 * s, topY + 2 * s, 5 * s, '#FFD700');
        // ツヤ
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * s;
        ctx.beginPath();
        ctx.moveTo(cx + 28 * s, topY + 30 * s);
        ctx.quadraticCurveTo(cx + 40 * s, topY + 50 * s, cx + 35 * s, topY + 70 * s);
        ctx.stroke();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 * s;
        break;
      case 'shortbob':
        // ショートボブ（外ハネ + 丸みボリューム）
        ctx.beginPath();
        ctx.moveTo(cx - 40 * s, topY - 10 * s);
        ctx.quadraticCurveTo(cx - 48 * s, topY + 25 * s, cx - 40 * s, topY + 50 * s);
        // 左の外ハネ
        ctx.quadraticCurveTo(cx - 48 * s, topY + 56 * s, cx - 44 * s, topY + 48 * s);
        ctx.lineTo(cx - 36 * s, topY + 55 * s);
        ctx.lineTo(cx + 36 * s, topY + 55 * s);
        // 右の外ハネ
        ctx.quadraticCurveTo(cx + 48 * s, topY + 56 * s, cx + 44 * s, topY + 48 * s);
        ctx.quadraticCurveTo(cx + 40 * s, topY + 50 * s, cx + 40 * s, topY + 50 * s);
        ctx.quadraticCurveTo(cx + 48 * s, topY + 25 * s, cx + 40 * s, topY - 10 * s);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // ツヤ
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2.5 * s;
        ctx.beginPath();
        ctx.moveTo(cx - 22 * s, topY + 15 * s);
        ctx.quadraticCurveTo(cx, topY + 10 * s, cx + 18 * s, topY + 18 * s);
        ctx.stroke();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 * s;
        break;
      case 'asymmetry':
        // アシンメトリー（左ロング右ショート + 風の流れ）
        ctx.fillStyle = idol.hairColor;
        ctx.beginPath();
        ctx.moveTo(cx - 40 * s, topY - 10 * s);
        // 左サイド（長い、S字カーブ）
        ctx.bezierCurveTo(cx - 44 * s, topY + 20 * s, cx - 40 * s, topY + 45 * s, cx - 36 * s, topY + 65 * s);
        ctx.quadraticCurveTo(cx - 42 * s, topY + 72 * s, cx - 38 * s, topY + 62 * s);
        // 右サイド（はねる毛先付きで長め）
        ctx.lineTo(cx + 38 * s, topY + 125 * s);
        ctx.quadraticCurveTo(cx + 46 * s, topY + 132 * s, cx + 44 * s, topY + 120 * s);
        ctx.lineTo(cx + 42 * s, topY + 130 * s);
        ctx.lineTo(cx + 40 * s, topY - 10 * s);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // サブカラーメッシュ
        if (idol.hairColorSub) {
          ctx.fillStyle = idol.hairColorSub;
          ctx.beginPath();
          ctx.moveTo(cx + 22 * s, topY); ctx.lineTo(cx + 26 * s, topY + 125 * s);
          ctx.lineTo(cx + 40 * s, topY + 115 * s); ctx.lineTo(cx + 38 * s, topY);
          ctx.closePath(); ctx.fill();
        }
        // ツヤ
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2 * s;
        ctx.beginPath();
        ctx.moveTo(cx + 5 * s, topY + 20 * s);
        ctx.quadraticCurveTo(cx + 25 * s, topY + 40 * s, cx + 20 * s, topY + 65 * s);
        ctx.stroke();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 * s;
        break;
    }
  }

  private static drawRibbonAccessory(ctx: CanvasRenderingContext2D, cx: number, idol: IdolData, s: number): void {
    const rx = cx + 20 * s;
    const ry = 18 * s;
    ctx.fillStyle = idol.hairStyle === 'asymmetry' ? '#E74C3C' : '#FFD700';
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx - 15 * s, ry - 10 * s, rx - 12 * s, ry); ctx.quadraticCurveTo(rx - 15 * s, ry + 8 * s, rx, ry); ctx.fill();
    ctx.beginPath(); ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx + 15 * s, ry - 10 * s, rx + 12 * s, ry); ctx.quadraticCurveTo(rx + 15 * s, ry + 8 * s, rx, ry); ctx.fill();
    SpriteGenerator.drawCircle(ctx, rx, ry, 3 * s, ctx.fillStyle as string);
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.moveTo(rx, ry); ctx.quadraticCurveTo(rx - 15 * s, ry - 10 * s, rx - 12 * s, ry);
    ctx.quadraticCurveTo(rx - 15 * s, ry + 8 * s, rx, ry);
    ctx.quadraticCurveTo(rx + 15 * s, ry - 10 * s, rx + 12 * s, ry);
    ctx.quadraticCurveTo(rx + 15 * s, ry + 8 * s, rx, ry);
    ctx.stroke();
  }
}
