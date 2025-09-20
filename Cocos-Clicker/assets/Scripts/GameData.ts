import { _decorator, Component } from 'cc';
import { UpgradeConfig, UpgradeData } from './Upgrades/UpgradeConfig';
import { ON_ADD_SCORE } from './Upgrades/UpgradeView';
const { ccclass, property } = _decorator;

export const ON_SCORE_CHANGED = 'on-score-changed';
export const ON_UPGRADE_PURCHASED = 'on-upgrade-purchased';

@ccclass('GameData')
export class GameData extends Component {
    @property(UpgradeConfig)
    private upgradeConfig: UpgradeConfig | null = null;

    private _score: number = 0;
    private _upgradeLevels: number[] = [];

    public get score(): number {
        return this._score;
    }

    onLoad() {
        // Initialize the levels array based on the config.
        this._upgradeLevels = new Array(this.upgradeConfig.upgrades.length).fill(0);
    }
    
    
    // --- Public API --- //

    public manualClick(): void {
        this._score++;
        this.node.emit(ON_SCORE_CHANGED, this._score);
    }

    public tryPurchaseUpgrade(upgradeId: number): void {
        const cost = this.getUpgradeCost(upgradeId);
        if (this._score >= cost) {
            this._score -= cost;
            this._upgradeLevels[upgradeId]++;

            // Emit two separate events to notify different systems.
            this.node.emit(ON_UPGRADE_PURCHASED, upgradeId, this._upgradeLevels[upgradeId]);
            this.node.emit(ON_SCORE_CHANGED, this._score);
        }
    }

    public addPassiveScore(amount: number): void {
        if (amount > 0) {
            this._score += amount;
            this.node.emit(ON_SCORE_CHANGED, this._score);
        }
    }
    

    // --- Helper Methods --- //

    public getUpgradeLevel(upgradeId: number): number {
        return this._upgradeLevels[upgradeId];
    }

    public getUpgradeCost(upgradeId: number): number {
        const upgradeData = this.upgradeConfig.upgrades[upgradeId];
        // Example cost formula: baseCost * 1.15 ^ level
        return Math.floor(upgradeData.baseCost * Math.pow(1.15, this._upgradeLevels[upgradeId]));
    }

    public getUpgradeData(upgradeId: number): UpgradeData{
        const upgradeData = this.upgradeConfig.upgrades[upgradeId];
        return upgradeData;
    }
}