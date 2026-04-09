// 定数定義

// 画面サイズ
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// カラーパレット
export const COLORS = {
  MAIN_PINK: 0xFF69B4,
  SUB_LAVENDER: 0xE6E6FA,
  ACCENT_GOLD: 0xFFD700,
  BG_DARK_PURPLE: 0x1a0a2e,
  TEXT_WHITE: 0xFFFFFF,
  DANGER_RED: 0xFF4444,
  SUCCESS_GREEN: 0x44FF44,
  MONEY_YELLOW: 0xFFD700,
} as const;

export const COLOR_STRINGS = {
  MAIN_PINK: '#FF69B4',
  SUB_LAVENDER: '#E6E6FA',
  ACCENT_GOLD: '#FFD700',
  BG_DARK_PURPLE: '#1a0a2e',
  TEXT_WHITE: '#FFFFFF',
  DANGER_RED: '#FF4444',
  SUCCESS_GREEN: '#44FF44',
  MONEY_YELLOW: '#FFD700',
} as const;

// フォント
export const FONT_FAMILY = '"M PLUS Rounded 1c", sans-serif';

// ヲタクタイプ
export enum OtakuType {
  JIRAI = '地雷系',
  RYOSAN = '量産型',
  KOSAN = '古参',
  SHINKI = '新規',
  YAKKAI = '厄介',
}

// タイプ相性マップ（攻撃側 → 防御側 → 倍率）
export const TYPE_CHART: Record<OtakuType, Record<OtakuType, number>> = {
  [OtakuType.JIRAI]:  { [OtakuType.JIRAI]: 1, [OtakuType.RYOSAN]: 1, [OtakuType.KOSAN]: 0.5, [OtakuType.SHINKI]: 2, [OtakuType.YAKKAI]: 1 },
  [OtakuType.RYOSAN]: { [OtakuType.JIRAI]: 1, [OtakuType.RYOSAN]: 1, [OtakuType.KOSAN]: 2, [OtakuType.SHINKI]: 1, [OtakuType.YAKKAI]: 0.5 },
  [OtakuType.KOSAN]:  { [OtakuType.JIRAI]: 2, [OtakuType.RYOSAN]: 0.5, [OtakuType.KOSAN]: 1, [OtakuType.SHINKI]: 1, [OtakuType.YAKKAI]: 1 },
  [OtakuType.SHINKI]: { [OtakuType.JIRAI]: 0.5, [OtakuType.RYOSAN]: 1, [OtakuType.KOSAN]: 1, [OtakuType.SHINKI]: 1, [OtakuType.YAKKAI]: 2 },
  [OtakuType.YAKKAI]: { [OtakuType.JIRAI]: 1, [OtakuType.RYOSAN]: 2, [OtakuType.KOSAN]: 1, [OtakuType.SHINKI]: 0.5, [OtakuType.YAKKAI]: 1 },
};

// 特典会アクション
export const TOKUTENKAI_ACTIONS = [
  { name: '手を握る', favorability: 10, money: 1000, description: 'ヲタクが赤面する' },
  { name: '目を見つめる', favorability: 20, money: 3000, description: 'キラキラエフェクト' },
  { name: '「好きだよ♡」と囁く', favorability: 50, money: 10000, description: 'ヲタクの目がハートに変化' },
  { name: '2ショットチェキ', favorability: 30, money: 5000, description: 'カメラフラッシュ演出' },
  { name: 'ハグする', favorability: 80, money: 30000, description: 'ヲタクが昇天' },
  { name: '指チュー', favorability: 100, money: 50000, description: 'ヲタクが完全に堕ちる' },
] as const;

// バトル技
export interface Skill {
  name: string;
  power: number;
  cost: number;
  description: string;
  type: 'attack' | 'buff' | 'defense';
  selfDamageRatio?: number;
}

export const SKILLS: Skill[] = [
  { name: 'スパチャ', power: 30, cost: 5000, description: '基本技。投げ銭を投げつける', type: 'attack' },
  { name: '推し活グッズ爆買い', power: 50, cost: 15000, description: 'CD・グッズを大量購入して投げる', type: 'attack' },
  { name: 'ガチ恋投資', power: 80, cost: 50000, description: '「俺の全てを推しに…」強力な一撃', type: 'attack' },
  { name: '全財産貢ぎ', power: 150, cost: 200000, description: '最強技。使用後ヲタクが瀕死に', type: 'attack', selfDamageRatio: 0.8 },
  { name: '推しへの誓い', power: 0, cost: 0, description: 'バフ技。次のターン攻撃力2倍', type: 'buff' },
  { name: '同担拒否バリア', power: 0, cost: 10000, description: '防御技。1ターンダメージ半減', type: 'defense' },
];

// ステージデータ
export interface StageData {
  id: number;
  name: string;
  rivalName: string;
  difficulty: number;
  rivalIdolIndex: number;
}

export const STAGES: StageData[] = [
  { id: 1, name: '小さなライブハウス', rivalName: '駆け出しアイドル', difficulty: 1, rivalIdolIndex: 0 },
  { id: 2, name: '地下アイドルの聖地', rivalName: '中堅アイドル', difficulty: 2, rivalIdolIndex: 1 },
  { id: 3, name: '大型特典会イベント', rivalName: '人気アイドル', difficulty: 3, rivalIdolIndex: 2 },
  { id: 4, name: '武道館', rivalName: 'トップアイドル', difficulty: 4, rivalIdolIndex: 3 },
  { id: 5, name: '東京ドーム', rivalName: '伝説のアイドル', difficulty: 5, rivalIdolIndex: 4 },
];
