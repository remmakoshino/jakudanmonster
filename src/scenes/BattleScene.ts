// BattleScene - 投げ銭バトル（ポケモン風ターン制）
import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY, COLOR_STRINGS, SKILLS, STAGES, OtakuType } from '../utils/constants';
import { IDOL_LIST } from '../characters/IdolData';
import { Otaku, generateEnemyTeam } from '../characters/OtakuData';
import { BattleSystem, BattleState } from '../battle/BattleSystem';
import { Skill } from '../utils/constants';

export class BattleScene extends Phaser.Scene {
  private selectedIdolIndex: number = 0;
  private stageId: number = 1;
  private playerTeam: Otaku[] = [];
  private battleSystem!: BattleSystem;

  // UI
  private playerSprite!: Phaser.GameObjects.Image;
  private enemySprite!: Phaser.GameObjects.Image;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private playerHpText!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private playerMoneyText!: Phaser.GameObjects.Text;
  private enemyMoneyText!: Phaser.GameObjects.Text;
  private playerNameText!: Phaser.GameObjects.Text;
  private enemyNameText!: Phaser.GameObjects.Text;
  private messageBox!: Phaser.GameObjects.Text;
  private skillButtons: Phaser.GameObjects.Container[] = [];
  private isAnimating: boolean = false;

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: { selectedIdolIndex: number; stageId: number; playerTeam: Otaku[] }): void {
    this.selectedIdolIndex = data.selectedIdolIndex;
    this.stageId = data.stageId;
    this.playerTeam = data.playerTeam;
  }

  create(): void {
    this.cameras.main.fadeIn(500);
    this.isAnimating = false;

    const stage = STAGES[this.stageId - 1];
    const difficulty = stage?.difficulty ?? 1;

    // 敵チーム生成
    const enemyTeam = generateEnemyTeam(difficulty);

    // バトルシステム初期化
    this.battleSystem = new BattleSystem(this.playerTeam, enemyTeam);

    // 背景描画
    this.drawBattleBackground();

    // ステージ情報
    this.add.text(GAME_WIDTH / 2, 15, `VS ${stage?.rivalName ?? 'ライバル'}`, {
      fontSize: '22px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.ACCENT_GOLD,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    // 敵側（上部）
    this.setupEnemyUI();

    // 味方側（下部）
    this.setupPlayerUI();

    // メッセージボックス
    const msgBg = this.add.graphics();
    msgBg.fillStyle(0x000000, 0.85);
    msgBg.fillRoundedRect(30, 460, GAME_WIDTH - 60, 60, 10);
    msgBg.lineStyle(2, 0xFFFFFF, 0.3);
    msgBg.strokeRoundedRect(30, 460, GAME_WIDTH - 60, 60, 10);

    this.messageBox = this.add.text(GAME_WIDTH / 2, 490, 'バトル開始！', {
      fontSize: '20px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // スキルボタン
    this.createSkillButtons();

    // 初期表示更新
    this.updateBattleUI();
  }

  private drawBattleBackground(): void {
    const bg = this.add.graphics();
    // 空
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x3e2a6e, 0x3e2a6e, 1);
    bg.fillRect(0, 0, GAME_WIDTH, 300);
    // 地面
    bg.fillGradientStyle(0x3e2a6e, 0x3e2a6e, 0x1a0a2e, 0x1a0a2e, 1);
    bg.fillRect(0, 300, GAME_WIDTH, GAME_HEIGHT - 300);
    // バトルフィールドの線
    bg.lineStyle(2, 0xFF69B4, 0.3);
    bg.strokeEllipse(GAME_WIDTH / 2, 300, 800, 200);
    // スポットライト
    bg.fillStyle(0xFF69B4, 0.05);
    bg.fillCircle(300, 350, 150);
    bg.fillCircle(900, 180, 150);
  }

  private setupEnemyUI(): void {
    const state = this.battleSystem.state;

    // 敵ヲタクスプライト
    const enemyTypeIndex = Object.values(OtakuType).indexOf(state.enemyOtaku.type);
    this.enemySprite = this.add.image(900, 180, `otaku_${enemyTypeIndex}_normal`).setScale(0.8);

    // 敵ステータスパネル
    const enemyPanel = this.add.graphics();
    enemyPanel.fillStyle(0x1a1a3e, 0.9);
    enemyPanel.fillRoundedRect(50, 50, 350, 90, 10);
    enemyPanel.lineStyle(2, 0xFF4444, 0.5);
    enemyPanel.strokeRoundedRect(50, 50, 350, 90, 10);

    this.enemyNameText = this.add.text(65, 58, '', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    });

    // HPバー背景
    this.add.graphics().fillStyle(0x333333, 1).fillRoundedRect(65, 85, 240, 16, 4);
    this.enemyHpBar = this.add.graphics();
    this.enemyHpText = this.add.text(310, 83, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    });

    this.enemyMoneyText = this.add.text(65, 110, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MONEY_YELLOW,
    });
  }

  private setupPlayerUI(): void {
    const state = this.battleSystem.state;

    // 味方ヲタクスプライト
    const playerTypeIndex = Object.values(OtakuType).indexOf(state.playerOtaku.type);
    this.playerSprite = this.add.image(300, 340, `otaku_${playerTypeIndex}_normal`).setScale(1.0);

    // 味方ステータスパネル
    const playerPanel = this.add.graphics();
    playerPanel.fillStyle(0x1a1a3e, 0.9);
    playerPanel.fillRoundedRect(GAME_WIDTH - 400, 340, 350, 100, 10);
    playerPanel.lineStyle(2, 0x4488FF, 0.5);
    playerPanel.strokeRoundedRect(GAME_WIDTH - 400, 340, 350, 100, 10);

    this.playerNameText = this.add.text(GAME_WIDTH - 385, 348, '', {
      fontSize: '18px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
      fontStyle: 'bold',
    });

    // HPバー背景
    this.add.graphics().fillStyle(0x333333, 1).fillRoundedRect(GAME_WIDTH - 385, 375, 240, 16, 4);
    this.playerHpBar = this.add.graphics();
    this.playerHpText = this.add.text(GAME_WIDTH - 140, 373, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: '#FFFFFF',
    });

    this.playerMoneyText = this.add.text(GAME_WIDTH - 385, 400, '', {
      fontSize: '14px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.MONEY_YELLOW,
    });
  }

  private createSkillButtons(): void {
    const startX = 80;
    const startY = 545;
    const btnW = 270;
    const btnH = 50;
    const gapX = 20;
    const gapY = 8;

    SKILLS.forEach((skill, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = startX + col * (btnW + gapX) + btnW / 2;
      const y = startY + row * (btnH + gapY) + btnH / 2;

      const container = this.add.container(x, y);

      const btn = this.add.image(0, 0, 'btn_skill');
      btn.setDisplaySize(btnW, btnH);
      btn.setInteractive({ useHandCursor: true });

      const nameText = this.add.text(-btnW / 2 + 15, -10, skill.name, {
        fontSize: '15px',
        fontFamily: FONT_FAMILY,
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      const costText = this.add.text(btnW / 2 - 15, -10, skill.cost > 0 ? `¥${skill.cost.toLocaleString()}` : '無料', {
        fontSize: '12px',
        fontFamily: FONT_FAMILY,
        color: COLOR_STRINGS.MONEY_YELLOW,
      }).setOrigin(1, 0.5);

      const powerText = this.add.text(0, 10, skill.type === 'attack' ? `威力: ${skill.power}` : skill.description, {
        fontSize: '11px',
        fontFamily: FONT_FAMILY,
        color: '#AAAAAA',
      }).setOrigin(0.5);

      container.add([btn, nameText, costText, powerText]);
      this.skillButtons.push(container);

      btn.on('pointerover', () => { if (!this.isAnimating) btn.setTint(0x88BBFF); });
      btn.on('pointerout', () => btn.clearTint());
      btn.on('pointerdown', () => {
        if (this.isAnimating) return;
        this.executePlayerTurn(skill);
      });
    });
  }

  private executePlayerTurn(skill: Skill): void {
    if (this.isAnimating || this.battleSystem.state.isOver) return;
    this.isAnimating = true;

    // スキルボタン一時無効化（視覚的に）
    this.skillButtons.forEach(c => c.setAlpha(0.5));

    // プレイヤーの攻撃
    const logs = this.battleSystem.executeSkill(skill, true);
    this.showBattleLogs(logs, () => {
      if (this.battleSystem.state.isOver) {
        this.endBattle();
        return;
      }

      // アタックアニメーション
      this.playerAttackAnimation(() => {
        this.updateBattleUI();

        // 敵のターン
        this.time.delayedCall(600, () => {
          const enemySkill = this.battleSystem.getEnemyAction();
          const enemyLogs = this.battleSystem.executeSkill(enemySkill, false);
          this.enemyAttackAnimation(() => {
            this.showBattleLogs(enemyLogs, () => {
              this.updateBattleUI();
              if (this.battleSystem.state.isOver) {
                this.endBattle();
              } else {
                this.isAnimating = false;
                this.skillButtons.forEach(c => c.setAlpha(1));
              }
            });
          });
        });
      });
    });
  }

  private playerAttackAnimation(onComplete: () => void): void {
    this.tweens.add({
      targets: this.playerSprite,
      x: this.playerSprite.x + 100,
      duration: 150,
      yoyo: true,
      onComplete: () => {
        // ダメージエフェクト
        this.tweens.add({
          targets: this.enemySprite,
          tint: 0xFF0000,
          duration: 100,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            this.enemySprite.clearTint();
            onComplete();
          },
        });
        this.showMoneyEffect(900, 150);
      },
    });
  }

  private enemyAttackAnimation(onComplete: () => void): void {
    this.tweens.add({
      targets: this.enemySprite,
      x: this.enemySprite.x - 100,
      duration: 150,
      yoyo: true,
      onComplete: () => {
        this.tweens.add({
          targets: this.playerSprite,
          tint: 0xFF0000,
          duration: 100,
          yoyo: true,
          repeat: 2,
          onComplete: () => {
            this.playerSprite.clearTint();
            onComplete();
          },
        });
        this.showMoneyEffect(300, 310);
      },
    });
  }

  private showMoneyEffect(x: number, y: number): void {
    // 投げ銭エフェクト（紙幣が舞い上がる）
    for (let i = 0; i < 8; i++) {
      const bill = this.add.text(
        x + (Math.random() - 0.5) * 100,
        y + 50,
        '💴',
        { fontSize: '20px' }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: bill,
        y: y - 100 - Math.random() * 50,
        x: bill.x + (Math.random() - 0.5) * 80,
        alpha: 0,
        angle: Math.random() * 360,
        duration: 800,
        delay: i * 50,
        onComplete: () => bill.destroy(),
      });
    }
  }

  private showBattleLogs(logs: string[], onComplete: () => void): void {
    let index = 0;
    const showNext = () => {
      if (index >= logs.length) {
        onComplete();
        return;
      }
      this.messageBox.setText(logs[index]);
      index++;
      this.time.delayedCall(800, showNext);
    };
    showNext();
  }

  private updateBattleUI(): void {
    const state = this.battleSystem.state;

    // プレイヤー側
    this.playerNameText.setText(`${state.playerOtaku.name} (${state.playerOtaku.type}) Lv.${state.playerOtaku.level}`);
    this.playerHpText.setText(`${state.playerOtaku.hp}/${state.playerOtaku.maxHp}`);
    this.playerMoneyText.setText(`残金: ¥${state.playerOtaku.money.toLocaleString()}`);
    this.drawHpBar(this.playerHpBar, GAME_WIDTH - 385, 375, 240, 16, state.playerOtaku.hp, state.playerOtaku.maxHp);

    // スプライト更新
    const playerTypeIndex = Object.values(OtakuType).indexOf(state.playerOtaku.type);
    this.playerSprite.setTexture(`otaku_${playerTypeIndex}_normal`);

    // 敵側
    this.enemyNameText.setText(`${state.enemyOtaku.name} (${state.enemyOtaku.type}) Lv.${state.enemyOtaku.level}`);
    this.enemyHpText.setText(`${state.enemyOtaku.hp}/${state.enemyOtaku.maxHp}`);
    this.enemyMoneyText.setText(`残金: ¥${state.enemyOtaku.money.toLocaleString()}`);
    this.drawHpBar(this.enemyHpBar, 65, 85, 240, 16, state.enemyOtaku.hp, state.enemyOtaku.maxHp);

    const enemyTypeIndex = Object.values(OtakuType).indexOf(state.enemyOtaku.type);
    this.enemySprite.setTexture(`otaku_${enemyTypeIndex}_normal`);

    // スキルボタンの有効/無効更新
    SKILLS.forEach((skill, i) => {
      const container = this.skillButtons[i];
      if (state.playerOtaku.money < skill.cost) {
        container.setAlpha(0.4);
      }
    });
  }

  private drawHpBar(gfx: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, hp: number, maxHp: number): void {
    gfx.clear();
    const ratio = Math.max(0, hp / maxHp);
    let color = 0x44FF44;
    if (ratio < 0.25) color = 0xFF4444;
    else if (ratio < 0.5) color = 0xFFAA00;
    gfx.fillStyle(color, 1);
    gfx.fillRoundedRect(x, y, w * ratio, h, 4);
  }

  private endBattle(): void {
    this.isAnimating = true;
    this.skillButtons.forEach(c => c.setAlpha(0.3));

    const won = this.battleSystem.state.playerWon;

    if (won) {
      // 勝利演出
      this.showVictoryEffect();
    }

    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(500);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('ResultScene', {
          selectedIdolIndex: this.selectedIdolIndex,
          stageId: this.stageId,
          won,
          playerTeam: this.playerTeam,
        });
      });
    });
  }

  private showVictoryEffect(): void {
    // 紙吹雪
    for (let i = 0; i < 30; i++) {
      const colors = ['#FF69B4', '#FFD700', '#87CEEB', '#FF4444', '#44FF44', '#E6E6FA'];
      const confetti = this.add.text(
        Math.random() * GAME_WIDTH,
        -20,
        '■',
        {
          fontSize: `${8 + Math.random() * 12}px`,
          color: colors[Math.floor(Math.random() * colors.length)],
        }
      ).setOrigin(0.5).setAngle(Math.random() * 360);

      this.tweens.add({
        targets: confetti,
        y: GAME_HEIGHT + 20,
        x: confetti.x + (Math.random() - 0.5) * 200,
        angle: confetti.angle + Math.random() * 720,
        duration: 2000 + Math.random() * 1000,
        delay: Math.random() * 500,
        onComplete: () => confetti.destroy(),
      });
    }

    // ゴールドコイン
    for (let i = 0; i < 10; i++) {
      const coin = this.add.text(
        Math.random() * GAME_WIDTH,
        -20,
        '🪙',
        { fontSize: '24px' }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: coin,
        y: GAME_HEIGHT + 20,
        duration: 1500 + Math.random() * 1000,
        delay: Math.random() * 800,
        onComplete: () => coin.destroy(),
      });
    }

    // 勝利テキスト
    const winText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, '🎉 勝 利 🎉', {
      fontSize: '56px',
      fontFamily: FONT_FAMILY,
      color: COLOR_STRINGS.ACCENT_GOLD,
      fontStyle: 'bold',
      stroke: '#FFFFFF',
      strokeThickness: 4,
    }).setOrigin(0.5).setScale(0);

    this.tweens.add({
      targets: winText,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
    });
  }
}
