// 金銭管理システム

export class MoneyManager {
  private _money: number;

  constructor(initialMoney: number = 0) {
    this._money = initialMoney;
  }

  get money(): number {
    return this._money;
  }

  add(amount: number): void {
    this._money += amount;
  }

  spend(amount: number): boolean {
    if (this._money >= amount) {
      this._money -= amount;
      return true;
    }
    return false;
  }

  canAfford(amount: number): boolean {
    return this._money >= amount;
  }

  formatMoney(amount?: number): string {
    const val = amount ?? this._money;
    return `¥${val.toLocaleString()}`;
  }
}
