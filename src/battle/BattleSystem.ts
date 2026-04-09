// バトルロジック
import { Otaku } from '../characters/OtakuData';
import { Skill, TYPE_CHART, SKILLS } from '../utils/constants';

export interface BattleState {
  playerOtaku: Otaku;
  enemyOtaku: Otaku;
  playerTeam: Otaku[];
  enemyTeam: Otaku[];
  playerCurrentIndex: number;
  enemyCurrentIndex: number;
  turn: number;
  isPlayerTurn: boolean;
  playerBuffMultiplier: number;
  enemyBuffMultiplier: number;
  playerDefenseMultiplier: number;
  enemyDefenseMultiplier: number;
  battleLog: string[];
  isOver: boolean;
  playerWon: boolean;
}

export class BattleSystem {
  state: BattleState;

  constructor(playerTeam: Otaku[], enemyTeam: Otaku[]) {
    this.state = {
      playerOtaku: playerTeam[0],
      enemyOtaku: enemyTeam[0],
      playerTeam,
      enemyTeam,
      playerCurrentIndex: 0,
      enemyCurrentIndex: 0,
      turn: 1,
      isPlayerTurn: true,
      playerBuffMultiplier: 1,
      enemyBuffMultiplier: 1,
      playerDefenseMultiplier: 1,
      enemyDefenseMultiplier: 1,
      battleLog: [],
      isOver: false,
      playerWon: false,
    };
  }

  executeSkill(skill: Skill, isPlayer: boolean): string[] {
    const logs: string[] = [];
    const attacker = isPlayer ? this.state.playerOtaku : this.state.enemyOtaku;
    const defender = isPlayer ? this.state.enemyOtaku : this.state.playerOtaku;
    const buffMult = isPlayer ? this.state.playerBuffMultiplier : this.state.enemyBuffMultiplier;
    const defMult = isPlayer ? this.state.enemyDefenseMultiplier : this.state.playerDefenseMultiplier;

    if (attacker.money < skill.cost) {
      logs.push(`${attacker.name}は所持金が足りない！`);
      return logs;
    }

    attacker.money -= skill.cost;

    if (skill.type === 'buff') {
      if (isPlayer) {
        this.state.playerBuffMultiplier = 2;
      } else {
        this.state.enemyBuffMultiplier = 2;
      }
      logs.push(`${attacker.name}の${skill.name}！次のターン攻撃力2倍！`);
      return logs;
    }

    if (skill.type === 'defense') {
      if (isPlayer) {
        this.state.playerDefenseMultiplier = 0.5;
      } else {
        this.state.enemyDefenseMultiplier = 0.5;
      }
      logs.push(`${attacker.name}の${skill.name}！ダメージ半減バリアを張った！`);
      return logs;
    }

    // 攻撃技
    const typeMultiplier = TYPE_CHART[attacker.type]?.[defender.type] ?? 1;
    const incomeBonus = attacker.monthlyIncome / 200000;
    const devotionBonus = attacker.devotion / 50;
    const baseDamage = skill.power * (1 + incomeBonus) * (1 + devotionBonus);
    const damage = Math.floor(baseDamage * typeMultiplier * buffMult * defMult);

    defender.hp = Math.max(0, defender.hp - damage);

    logs.push(`${attacker.name}の${skill.name}！`);
    if (typeMultiplier > 1) logs.push('効果はバツグンだ！');
    else if (typeMultiplier < 1) logs.push('効果はいまひとつだ…');
    logs.push(`${defender.name}に${damage}のダメージ！`);

    // 自傷ダメージ（全財産貢ぎ）
    if (skill.selfDamageRatio) {
      const selfDmg = Math.floor(attacker.maxHp * skill.selfDamageRatio);
      attacker.hp = Math.max(1, attacker.hp - selfDmg);
      logs.push(`${attacker.name}は反動で${selfDmg}のダメージを受けた！`);
    }

    // バフリセット
    if (isPlayer) this.state.playerBuffMultiplier = 1;
    else this.state.enemyBuffMultiplier = 1;
    // 防御リセット
    if (isPlayer) this.state.enemyDefenseMultiplier = 1;
    else this.state.playerDefenseMultiplier = 1;

    // 倒れたチェック
    if (defender.hp <= 0) {
      logs.push(`${defender.name}は倒れた！`);
      if (isPlayer) {
        this.state.enemyCurrentIndex++;
        if (this.state.enemyCurrentIndex >= this.state.enemyTeam.length) {
          this.state.isOver = true;
          this.state.playerWon = true;
          logs.push('勝利！');
        } else {
          this.state.enemyOtaku = this.state.enemyTeam[this.state.enemyCurrentIndex];
          logs.push(`相手は${this.state.enemyOtaku.name}を繰り出した！`);
        }
      } else {
        this.state.playerCurrentIndex++;
        if (this.state.playerCurrentIndex >= this.state.playerTeam.length) {
          this.state.isOver = true;
          this.state.playerWon = false;
          logs.push('敗北…');
        } else {
          this.state.playerOtaku = this.state.playerTeam[this.state.playerCurrentIndex];
          logs.push(`${this.state.playerOtaku.name}を繰り出した！`);
        }
      }
    }

    return logs;
  }

  getEnemyAction(): Skill {
    // 使える技の中からランダムに選択（所持金が足りるものだけ）
    const available = SKILLS.filter(s => this.state.enemyOtaku.money >= s.cost);
    if (available.length === 0) return SKILLS[0]; // スパチャをデフォルトに
    return available[Math.floor(Math.random() * available.length)];
  }
}
