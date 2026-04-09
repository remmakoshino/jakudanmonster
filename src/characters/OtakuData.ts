// ヲタクデータ定義
import { OtakuType } from '../utils/constants';

export interface Otaku {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  monthlyIncome: number;
  devotion: number;
  blindness: number;
  money: number;
  type: OtakuType;
  favorability: number;
}

const FIRST_NAMES = ['太郎', '次郎', '健太', '翔太', '大輔', '和也', '直樹', '拓也', '雄介', '大地',
  '竜也', '裕太', '啓介', '大樹', '慎太郎', '陽介', '哲也', '修平', '浩二', '秀一'];
const LAST_NAMES = ['田中', '佐藤', '鈴木', '高橋', '伊藤', '渡辺', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '松本', '石井', '斎藤', '林', '清水', '山口', '池田', '橋本'];

export function generateRandomName(): string {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${last}${first}`;
}

export function generateOtaku(level: number, type?: OtakuType): Otaku {
  const types = Object.values(OtakuType);
  const otakuType = type ?? types[Math.floor(Math.random() * types.length)];
  const baseHp = 50 + level * 10 + Math.floor(Math.random() * 20);
  const baseIncome = 150000 + level * 5000 + Math.floor(Math.random() * 50000);

  return {
    name: generateRandomName(),
    level,
    hp: baseHp,
    maxHp: baseHp,
    monthlyIncome: baseIncome,
    devotion: 10 + level * 2 + Math.floor(Math.random() * 10),
    blindness: 10 + level * 2 + Math.floor(Math.random() * 10),
    money: baseIncome * 2 + Math.floor(Math.random() * 100000),
    type: otakuType,
    favorability: 0,
  };
}

export function generateEnemyTeam(difficulty: number): Otaku[] {
  const teamSize = Math.min(3, 1 + difficulty);
  const baseLevel = difficulty * 8 + Math.floor(Math.random() * 5);
  const team: Otaku[] = [];
  for (let i = 0; i < teamSize; i++) {
    team.push(generateOtaku(baseLevel + Math.floor(Math.random() * 5)));
  }
  return team;
}
