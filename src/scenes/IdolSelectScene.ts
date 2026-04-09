// IdolSelectScene - アイドル選択画面
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS } from '../utils/constants';
import { IDOL_LIST } from '../characters/IdolData';

export class IdolSelectScene extends Phaser.Scene {
  private selectedIndex: number = 0;
  private detailTexts: Phaser.GameObjects.Text[] = [];
  private idolImages: Phaser.GameObjects.Image[] = [];
  private selectFrame!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'IdolSelectScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(500);
    this.selectedIndex = 0;
    this.detailTexts = [];
    this.idolImages = [];

    // 背景
    this.add.graphics()
      .fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2e1a4e, 0x2e1a4e, 1)
      .fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // タイトル
    this.add.text(GAME_WIDTH / 2, 40, 'アイドルを選択', {
      fontSize: '36px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MAIN_PINK,
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // 選択枠
    this.selectFrame = this.add.graphics();

    // アイドルカード配置
    IDOL_LIST.forEach((idol, i) => {
      const x = 140 + i * 210;
      const y = 200;

      // カード背景
      const cardBg = this.add.graphics();
      cardBg.fillStyle(0x2a1a3e, 0.9);
      cardBg.fillRoundedRect(x - 90, y - 100, 180, 280, 16);
      cardBg.lineStyle(2, idol.colorHex, 0.8);
      cardBg.strokeRoundedRect(x - 90, y - 100, 180, 280, 16);

      // キャラ画像
      const img = this.add.image(x, y - 20, `idol_${i}`).setScale(0.7);
      this.idolImages.push(img);

      // 名前
      this.add.text(x, y + 85, idol.name, {
        fontSize: '20px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // カラー名
      this.add.text(x, y + 110, idol.color, {
        fontSize: '14px',
        fontFamily: FONT_FAMILY,
        color: idol.hairColor,
      }).setOrigin(0.5);

      // 特性
      this.add.text(x, y + 135, idol.trait, {
        fontSize: '11px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.ACCENT_GOLD,
      }).setOrigin(0.5);

      // インタラクション
      const hitArea = this.add.zone(x, y + 40, 180, 280).setInteractive({ useHandCursor: true });
      hitArea.on('pointerdown', () => {
        this.selectedIndex = i;
        this.updateSelection();
      });
    });

    // 詳細パネル
    const panelY = 520;
    const detailBg = this.add.graphics();
    detailBg.fillStyle(0x1a0a2e, 0.95);
    detailBg.fillRoundedRect(100, panelY - 30, GAME_WIDTH - 200, 120, 12);
    detailBg.lineStyle(2, 0xFF69B4, 0.5);
    detailBg.strokeRoundedRect(100, panelY - 30, GAME_WIDTH - 200, 120, 12);

    this.detailTexts.push(
      this.add.text(GAME_WIDTH / 2, panelY, '', {
        fontSize: '22px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5),
      this.add.text(GAME_WIDTH / 2, panelY + 30, '', {
        fontSize: '16px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.ACCENT_GOLD,
      }).setOrigin(0.5),
      this.add.text(GAME_WIDTH / 2, panelY + 55, '', {
        fontSize: '14px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.SUB_LAVENDER,
      }).setOrigin(0.5),
    );

    // 決定ボタン
    const confirmBtn = this.add.image(GAME_WIDTH / 2, 670, 'btn_gold').setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2, 670, 'この子に決定！', {
      fontSize: '22px',
      fontFamily: FONT_FAMILY,
      color: '#000000',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    confirmBtn.on('pointerover', () => confirmBtn.setTint(0xFFEE88));
    confirmBtn.on('pointerout', () => confirmBtn.clearTint());
    confirmBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('TokutenkaiScene', {
          selectedIdolIndex: this.selectedIndex,
          stageId: 1,
        });
      });
    });

    this.updateSelection();
  }

  private updateSelection(): void {
    const idol = IDOL_LIST[this.selectedIndex];
    this.detailTexts[0].setText(`${idol.name} — 固有スキル: ${idol.uniqueSkill.name}`);
    this.detailTexts[1].setText(`特性: ${idol.trait}`);
    this.detailTexts[2].setText(`固有スキル効果: ${idol.uniqueSkill.description}`);

    // 選択枠の更新
    this.selectFrame.clear();
    const x = 140 + this.selectedIndex * 210;
    const y = 200;
    this.selectFrame.lineStyle(4, 0xFFD700, 1);
    this.selectFrame.strokeRoundedRect(x - 94, y - 104, 188, 288, 18);

    // アニメーション
    this.idolImages.forEach((img, i) => {
      this.tweens.killTweensOf(img);
      if (i === this.selectedIndex) {
        img.setScale(0.8);
        this.tweens.add({
          targets: img,
          y: 175,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      } else {
        img.setScale(0.65).setY(180);
      }
    });
  }
}
