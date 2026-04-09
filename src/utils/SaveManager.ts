// セーブデータ管理
import { Otaku } from '../characters/OtakuData';

interface SaveData {
  clearedStages: number[];
  ownedOtaku: Otaku[];
  totalMoney: number;
  selectedIdol: string;
  playTime: number;
}

const SAVE_KEY = 'jakudanmonster_save';

export function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function saveSaveData(data: SaveData): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function getDefaultSaveData(): SaveData {
  return {
    clearedStages: [],
    ownedOtaku: [],
    totalMoney: 0,
    selectedIdol: '',
    playTime: 0,
  };
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
