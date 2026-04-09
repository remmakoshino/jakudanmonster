// SpriteGenerator - Canvas APIでキャラスプライトを生成するユーティリティ
import Phaser from 'phaser';

export class SpriteGenerator {
  static generateTexture(
    scene: Phaser.Scene,
    key: string,
    width: number,
    height: number,
    drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ): void {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawFn(ctx, width, height);
    scene.textures.addCanvas(key, canvas);
  }

  static drawEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, color: string): void {
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  static drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string): void {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  static drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    const topCurveHeight = size * 0.3;
    ctx.moveTo(cx, cy + size * 0.35);
    ctx.bezierCurveTo(cx, cy + size * 0.35 - topCurveHeight, cx - size / 2, cy - topCurveHeight, cx - size / 2, cy);
    ctx.bezierCurveTo(cx - size / 2, cy + size * 0.2, cx, cy + size * 0.5, cx, cy + size * 0.7);
    ctx.bezierCurveTo(cx, cy + size * 0.5, cx + size / 2, cy + size * 0.2, cx + size / 2, cy);
    ctx.bezierCurveTo(cx + size / 2, cy - topCurveHeight, cx, cy + size * 0.35 - topCurveHeight, cx, cy + size * 0.35);
    ctx.fill();
    ctx.closePath();
  }

  static drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, points: number, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.closePath();
  }
}
