// TokutenkaiScene - 特典会（色恋営業フェーズ）
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS, TOKUTENKAI_ACTIONS, OtakuType, STAGES } from '../utils/constants';
import { IDOL_LIST } from '../characters/IdolData';
import { Otaku, generateOtaku } from '../characters/OtakuData';
import { OtakuGenerator, OtakuExpression } from '../characters/OtakuGenerator';
import { MoneyManager } from '../battle/MoneyManager';

export class TokutenkaiScene extends Phaser.Scene {
  private selectedIdolIndex: number = 0;
  private stageId: number = 1;
  private currentOtakuIndex: number = 0;
  private otakuQueue: Otaku[] = [];
  private capturedOtaku: Otaku[] = [];
  private moneyManager!: MoneyManager;
  private totalTurns: number = 5;
  private currentTurn: number = 0;

  // UI elements
  private otakuSprite!: Phaser.GameObjects.Image;
  private favText!: Phaser.GameObjects.Text;
  private moneyText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  private otakuNameText!: Phaser.GameObjects.Text;
  private otakuTypeText!: Phaser.GameObjects.Text;
  private capturedText!: Phaser.GameObjects.Text;
  private actionButtons: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: 'TokutenkaiScene' });
  }

  init(data: { selectedIdolIndex: number; stageId: number }): void {
    this.selectedIdolIndex = data.selectedIdolIndex;
    this.stageId = data.stageId;
  }

  create(): void {
    this.cameras.main.fadeIn(500);
    this.moneyManager = new MoneyManager(0);
    this.currentOtakuIndex = 0;
    this.currentTurn = 0;
    this.capturedOtaku = [];

    const stage = STAGES[this.stageId - 1];
    const difficulty = stage?.difficulty ?? 1;
    this.totalTurns = 3 + difficulty;

    // ヲタク生成
    this.otakuQueue = [];
    for (let i = 0; i < this.totalTurns; i++) {
      const level = difficulty * 5 + Math.floor(Math.random() * 10);
      this.otakuQueue.push(generateOtaku(level));
    }

    // 背景
    this.drawBackground();

    // ステージ名
    this.add.text(GAME_WIDTH / 2, 25, `ステージ${this.stageId}: ${stage?.name ?? '特典会'}`, {
      fontSize: '22px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.ACCENT_GOLD,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // アイドル表示（左側）
    const idol = IDOL_LIST[this.selectedIdolIndex];
    this.add.image(180, 300, `idol_${this.selectedIdolIndex}_large`).setScale(0.7);
    this.add.text(180, 430, idol.name, {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // ヲタク表示（右側）
    this.otakuSprite = this.add.image(900, 280, 'otaku_0_normal').setScale(1.0);

    this.otakuNameText = this.add.text(900, 420, '', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.otakuTypeText = this.add.text(900, 445, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.SUB_LAVENDER,
    }).setOrigin(0.5);

    // 好感度バー
    this.add.text(700, 470, '好感度:', {
      fontSize: '16px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    });
    this.favText = this.add.text(1050, 470, '0%', {
      fontSize: '16px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MAIN_PINK,
      fontStyle: 'bold',
    }).setOrigin(1, 0);

    // 所持金
    this.moneyText = this.add.text(GAME_WIDTH / 2, 55, '所持金: ¥0', {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MONEY_YELLOW,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // ターン表示
    this.turnText = this.add.text(GAME_WIDTH - 30, 25, '', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    }).setOrigin(1, 0);

    // 獲得ヲタク数
    this.capturedText = this.add.text(30, 55, '手持ちヲタク: 0', {
      fontSize: '16px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.TEXT_WHITE,
    });

    // メッセージ
    const msgBg = this.add.graphics();
    msgBg.fillStyle(0x000000, 0.7);
    msgBg.fillRoundedRect(GAME_WIDTH / 2 - 300, 500, 600, 50, 10);
    this.messageText = this.add.text(GAME_WIDTH / 2, 525, '色恋営業で、ヲタクの心を掴め！', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    }).setOrigin(0.5);

    // アクションボタン
    this.createActionButtons();

    // 最初のヲタク表示
    this.showCurrentOtaku();
  }

  private drawBackground(): void {
    const bg = this.add.graphics();
    // ステージ背景（特典会ブース）
    bg.fillGradientStyle(0x2e1a4e, 0x2e1a4e, 0x1a0a2e, 0x1a0a2e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // ブースのテーブル
    bg.fillStyle(0x8B4513, 1);
    bg.fillRect(300, 350, 500, 15);
    // テーブル脚
    bg.fillRect(350, 365, 10, 80);
    bg.fillRect(740, 365, 10, 80);

    // 背景の装飾（ライト）
    bg.fillStyle(0xFF69B4, 0.1);
    bg.fillCircle(200, 100, 150);
    bg.fillStyle(0x9B59B6, 0.1);
    bg.fillCircle(1000, 100, 150);

    // 垂れ幕
    bg.fillStyle(0xFF69B4, 0.3);
    bg.fillRect(0, 80, GAME_WIDTH, 5);
    bg.fillRect(0, 88, GAME_WIDTH, 3);
  }

  private createActionButtons(): void {
    const startY = 560;
    const cols = 3;
    const btnW = 250;
    const btnH = 50;
    const gapX = 20;
    const gapY = 8;
    const totalW = cols * btnW + (cols - 1) * gapX;
    const startX = (GAME_WIDTH - totalW) / 2;

    TOKUTENKAI_ACTIONS.forEach((action, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (btnW + gapX) + btnW / 2;
      const y = startY + row * (btnH + gapY) + btnH / 2;

      const container = this.add.container(x, y);

      const btn = this.add.image(0, 0, 'btn_action');
      btn.setDisplaySize(btnW, btnH);
      btn.setInteractive({ useHandCursor: true });

      const text = this.add.text(0, -8, action.name, {
        fontSize: '16px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      const subText = this.add.text(0, 12, `♡+${action.favorability}  ¥+${action.money.toLocaleString()}`, {
        fontSize: '11px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.ACCENT_GOLD,
      }).setOrigin(0.5);

      container.add([btn, text, subText]);
      this.actionButtons.push(container);

      btn.on('pointerover', () => btn.setTint(0xFFAACC));
      btn.on('pointerout', () => btn.clearTint());
      btn.on('pointerdown', () => this.executeAction(i));
    });
  }

  private showCurrentOtaku(): void {
    if (this.currentOtakuIndex >= this.otakuQueue.length) {
      this.endTokutenkai();
      return;
    }

    this.currentTurn++;
    const otaku = this.otakuQueue[this.currentOtakuIndex];
    otaku.favorability = 0;

    const typeIndex = Object.values(OtakuType).indexOf(otaku.type);
    const key = `otaku_${typeIndex}_normal`;

    this.otakuSprite.setTexture(key);
    this.otakuNameText.setText(otaku.name);
    this.otakuTypeText.setText(`タイプ: ${otaku.type}  Lv.${otaku.level}`);
    this.turnText.setText(`${this.currentTurn}/${this.totalTurns}`);
    this.updateFavDisplay(otaku);

    // 登場アニメーション
    this.otakuSprite.setX(GAME_WIDTH + 100);
    this.tweens.add({
      targets: this.otakuSprite,
      x: 900,
      duration: 500,
      ease: 'Back.easeOut',
    });
  }

  private executeAction(actionIndex: number): void {
    const otaku = this.otakuQueue[this.currentOtakuIndex];
    if (!otaku) return;

    const action = TOKUTENKAI_ACTIONS[actionIndex];
    const idol = IDOL_LIST[this.selectedIdolIndex];

    // アイドル特性ボーナス
    let favBonus = 1;
    let moneyBonus = 1;
    if (idol.traitBonus.type === 'romance') favBonus += idol.traitBonus.value;
    if (idol.traitBonus.type === 'money') moneyBonus += idol.traitBonus.value;

    const favGain = Math.floor(action.favorability * favBonus);
    const moneyGain = Math.floor(action.money * moneyBonus);

    otaku.favorability = Math.min(100, otaku.favorability + favGain);
    this.moneyManager.add(moneyGain);

    // UI更新
    this.moneyText.setText(`所持金: ${this.moneyManager.formatMoney()}`);
    this.updateFavDisplay(otaku);
    this.messageText.setText(`${action.name}！ ${action.description}`);

    // エフェクト
    this.showActionEffect(actionIndex, otaku);

    // ヲタクの表情変更
    this.updateOtakuExpression(otaku);

    // 金額ポップアップ
    const popup = this.add.text(900, 200, `+¥${moneyGain.toLocaleString()}`, {
      fontSize: '28px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MONEY_YELLOW,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: popup,
      y: 150,
      alpha: 0,
      duration: 1000,
      onComplete: () => popup.destroy(),
    });

    // 好感度MAXチェック
    if (otaku.favorability >= 80) {
      this.time.delayedCall(800, () => this.tryCapture(otaku));
    } else if (otaku.favorability >= 100) {
      // 自動次のヲタクへ
    }

    // MAXでなければ次のアクションを待つ
    // 一定時間後に次のヲタクへ
    if (otaku.favorability < 80) {
      // ボタンを再度有効に
    }
  }

  private updateOtakuExpression(otaku: Otaku): void {
    const typeIndex = Object.values(OtakuType).indexOf(otaku.type);
    let expr: OtakuExpression = 'normal';
    if (otaku.favorability >= 100) expr = 'ascend';
    else if (otaku.favorability >= 80) expr = 'heart';
    else if (otaku.favorability >= 60) expr = 'sparkle';
    else if (otaku.favorability >= 30) expr = 'blush';

    const key = `otaku_${typeIndex}_${expr}`;
    this.otakuSprite.setTexture(key);

    // 表情変化アニメーション
    this.tweens.add({
      targets: this.otakuSprite,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 150,
      yoyo: true,
    });
  }

  private showActionEffect(actionIndex: number, _otaku: Otaku): void {
    // アクションに応じたエフェクト
    switch (actionIndex) {
      case 0: // 手を握る - 赤面
        this.flashScreen(0xFF9999, 0.2);
        break;
      case 1: // 目を見つめる - キラキラ
        this.showSparkleEffect();
        break;
      case 2: // 「好きだよ♡」- ハート
        this.showHeartEffect();
        break;
      case 3: // 2ショットチェキ - フラッシュ
        this.flashScreen(0xFFFFFF, 0.8);
        break;
      case 4: // ハグ - 昇天
        this.showAscendEffect();
        break;
      case 5: // 指チュー - 完全堕ち
        this.showYubiChuEffect();
        break;
    }
  }

  private flashScreen(color: number, alpha: number): void {
    const flash = this.add.graphics();
    flash.fillStyle(color, alpha);
    flash.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy(),
    });
  }

  private showSparkleEffect(): void {
    for (let i = 0; i < 8; i++) {
      const star = this.add.graphics();
      const x = 800 + Math.random() * 200;
      const y = 200 + Math.random() * 200;
      star.fillStyle(0xFFD700, 1);
      // 4角星（ダイヤモンド型で代替）
      star.fillRect(x - 3, y - 6, 6, 12);
      star.fillRect(x - 6, y - 3, 12, 6);
      this.tweens.add({
        targets: star,
        alpha: 0,
        scaleX: 2,
        scaleY: 2,
        duration: 600,
        delay: i * 50,
        onComplete: () => star.destroy(),
      });
    }
  }

  private showHeartEffect(): void {
    for (let i = 0; i < 10; i++) {
      const heart = this.add.text(
        850 + Math.random() * 100,
        350,
        '♡',
        {
          fontSize: `${20 + Math.random() * 20}px`,
          fontFamily: FONT_FAMILY,
          color: '#FF1493',
        }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: heart,
        y: 100 + Math.random() * 100,
        x: heart.x + (Math.random() - 0.5) * 100,
        alpha: 0,
        duration: 1500,
        delay: i * 100,
        onComplete: () => heart.destroy(),
      });
    }
  }

  private showAscendEffect(): void {
    // 白フラッシュ
    this.flashScreen(0xFFFFFF, 0.9);
    // 天使の羽根
    for (let i = 0; i < 6; i++) {
      const feather = this.add.text(
        750 + Math.random() * 300,
        500,
        '🪶',
        { fontSize: '24px' }
      ).setOrigin(0.5);
      this.tweens.add({
        targets: feather,
        y: -50,
        x: feather.x + (Math.random() - 0.5) * 200,
        alpha: 0,
        duration: 2000,
        delay: i * 150,
        onComplete: () => feather.destroy(),
      });
    }
    // 後光テキスト
    const holyText = this.add.text(900, 200, '✨ 昇 天 ✨', {
      fontSize: '36px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.ACCENT_GOLD,
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: holyText,
      alpha: 1,
      y: 170,
      duration: 600,
      hold: 800,
      yoyo: true,
      onComplete: () => holyText.destroy(),
    });
  }

  private showYubiChuEffect(): void {
    // ゆっくりピンクフラッシュ
    this.flashScreen(0xFF69B4, 0.6);
    // 大量のハート上昇
    for (let i = 0; i < 20; i++) {
      const heart = this.add.text(
        700 + Math.random() * 400,
        500 + Math.random() * 100,
        '♡',
        {
          fontSize: `${24 + Math.random() * 30}px`,
          fontFamily: FONT_FAMILY,
          color: i % 2 === 0 ? '#FF1493' : '#FF69B4',
        }
      ).setOrigin(0.5);
      this.tweens.add({
        targets: heart,
        y: -50 - Math.random() * 100,
        x: heart.x + (Math.random() - 0.5) * 150,
        alpha: 0,
        duration: 2000 + Math.random() * 500,
        delay: i * 80,
        onComplete: () => heart.destroy(),
      });
    }
    // キラキラ追加
    this.showSparkleEffect();
    // テキスト演出
    const yubiText = this.add.text(900, 200, '💋 指チュー 💋', {
      fontSize: '42px',
      fontFamily: FONT_FAMILY,
      color: '#FF1493',
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({
      targets: yubiText,
      alpha: 1,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 400,
      hold: 1000,
      yoyo: true,
      onComplete: () => yubiText.destroy(),
    });
  }

  private tryCapture(otaku: Otaku): void {
    const idol = IDOL_LIST[this.selectedIdolIndex];
    let captureRate = otaku.favorability / 100;
    if (idol.traitBonus.type === 'capture') captureRate += idol.traitBonus.value;

    const captured = Math.random() < captureRate;
    if (captured) {
      this.capturedOtaku.push(otaku);
      this.capturedText.setText(`手持ちヲタク: ${this.capturedOtaku.length}`);
      this.messageText.setText(`${otaku.name}を獲得した！「推し事に全財産を捧げます…」`);

      // 獲得エフェクト
      this.flashScreen(0xFF69B4, 0.4);
    } else {
      this.messageText.setText(`${otaku.name}は逃げ出した…`);
    }

    // 次のヲタクへ
    this.time.delayedCall(1500, () => {
      this.currentOtakuIndex++;
      if (this.currentOtakuIndex < this.otakuQueue.length) {
        this.showCurrentOtaku();
      } else {
        this.endTokutenkai();
      }
    });
  }

  private updateFavDisplay(otaku: Otaku): void {
    this.favText.setText(`${otaku.favorability}%`);
  }

  private endTokutenkai(): void {
    // ボタン無効化
    this.actionButtons.forEach(container => container.setAlpha(0.5));

    const resultBg = this.add.graphics();
    resultBg.fillStyle(0x000000, 0.8);
    resultBg.fillRoundedRect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 150, 500, 300, 20);
    resultBg.lineStyle(3, 0xFFD700, 1);
    resultBg.strokeRoundedRect(GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2 - 150, 500, 300, 20);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 110, '特典会終了！', {
      fontSize: '32px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MAIN_PINK,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, `獲得金額: ${this.moneyManager.formatMoney()}`, {
      fontSize: '24px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MONEY_YELLOW,
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, `獲得ヲタク: ${this.capturedOtaku.length}人`, {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    }).setOrigin(0.5);

    // 獲得ヲタクがいない場合、デフォルトヲタクを付与
    if (this.capturedOtaku.length === 0) {
      const defaultOtaku = generateOtaku(this.stageId * 5);
      this.capturedOtaku.push(defaultOtaku);
      this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, `※応援ヲタク${defaultOtaku.name}が駆けつけた！`, {
        fontSize: '14px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.SUB_LAVENDER,
      }).setOrigin(0.5);
    }

    // バトルへボタン
    const battleBtn = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, 'btn_red').setInteractive({ useHandCursor: true });
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80, 'バトルへ進む！', {
      fontSize: '22px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    battleBtn.on('pointerdown', () => {
      // ヲタクに所持金を分配
      const moneyPerOtaku = Math.floor(this.moneyManager.money / this.capturedOtaku.length);
      this.capturedOtaku.forEach(o => { o.money += moneyPerOtaku; });

      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('BattleScene', {
          selectedIdolIndex: this.selectedIdolIndex,
          stageId: this.stageId,
          playerTeam: this.capturedOtaku,
        });
      });
    });
  }
}
