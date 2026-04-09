// アイドルデータ定義

export interface IdolData {
  name: string;
  color: string;
  colorHex: number;
  trait: string;
  traitBonus: { type: 'romance' | 'money' | 'capture' | 'attack' | 'blindness'; value: number };
  uniqueSkill: { name: string; description: string };
  hairStyle: 'twintail' | 'longstraight' | 'ponytail' | 'shortbob' | 'asymmetry';
  hairColor: string;
  hairColorSub?: string;
}

export const IDOL_LIST: IdolData[] = [
  {
    name: '星宮りん',
    color: 'ピンク',
    colorHex: 0xFF69B4,
    trait: '色恋営業力 +30%',
    traitBonus: { type: 'romance', value: 0.3 },
    uniqueSkill: { name: '運命の出会い演出', description: '好感度+100' },
    hairStyle: 'twintail',
    hairColor: '#FF69B4',
  },
  {
    name: '月城あいか',
    color: '紫',
    colorHex: 0x9B59B6,
    trait: '獲得金額 +20%',
    traitBonus: { type: 'money', value: 0.2 },
    uniqueSkill: { name: '整形疑惑の涙', description: '相手混乱' },
    hairStyle: 'longstraight',
    hairColor: '#9B59B6',
  },
  {
    name: '虹野そら',
    color: '水色',
    colorHex: 0x87CEEB,
    trait: 'ヲタク捕獲率 +25%',
    traitBonus: { type: 'capture', value: 0.25 },
    uniqueSkill: { name: '清楚系裏アカ暴露', description: '相手ヲタク寝返り' },
    hairStyle: 'ponytail',
    hairColor: '#87CEEB',
  },
  {
    name: '炎堂れいな',
    color: '赤',
    colorHex: 0xE74C3C,
    trait: 'バトル攻撃力 +25%',
    traitBonus: { type: 'attack', value: 0.25 },
    uniqueSkill: { name: '炎上商法', description: '全体攻撃' },
    hairStyle: 'shortbob',
    hairColor: '#E74C3C',
  },
  {
    name: '闇宮ゆめ',
    color: '黒',
    colorHex: 0x2C2C2C,
    trait: 'ヲタク盲目度 +40%',
    traitBonus: { type: 'blindness', value: 0.4 },
    uniqueSkill: { name: 'メンヘラ営業', description: '毎ターンHP吸収' },
    hairStyle: 'asymmetry',
    hairColor: '#1a1a1a',
    hairColorSub: '#E74C3C',
  },
];
