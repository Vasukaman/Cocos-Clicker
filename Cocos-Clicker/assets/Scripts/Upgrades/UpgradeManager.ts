import { _decorator, Component, Node, Prefab, instantiate, Vec3, UIOpacity } from 'cc';
import { GameData, ON_SCORE_CHANGED, ON_UPGRADE_PURCHASED } from '../GameData';
import { UpgradeConfig } from './UpgradeConfig';
import { ON_BUY_UPGRADE_REQUEST, UpgradeView } from './UpgradeView';
const { ccclass, property } = _decorator;

@ccclass('UpgradeManager')
export class UpgradeManager extends Component {

    @property(GameData)
    private gameData: GameData | null = null;

    @property(UpgradeConfig)
    private upgradeConfig: UpgradeConfig | null = null;

    @property(Prefab)
    private upgradePrefab: Prefab | null = null;
    
    @property(Node)
    private upgradeRingParent: Node | null = null;

    private upgradeViews: UpgradeView[] = [];
    private upgradeTimers: number[] = []; // Array to store a timer for each upgrade

    start() {
        if (!this.gameData || !this.upgradeConfig || !this.upgradePrefab || !this.upgradeRingParent) {
            console.error("UpgradeManager is missing a required property.");
            return;
        }

        this.gameData.node.on(ON_SCORE_CHANGED, this.onScoreChanged, this);
        this.gameData.node.on(ON_UPGRADE_PURCHASED, this.onUpgradePurchased, this);
        
        this.spawnUpgradeViews();
    }
    

     update(deltaTime: number) {
        if (!this.gameData) return;
        
        const parentRotation = this.upgradeRingParent.angle;

        for (let i = 0; i < this.upgradeViews.length; i++) {
            this.upgradeViews[i].updateGlobalRotation(parentRotation);
            
            const upgradeLevel = this.gameData.getUpgradeLevel(i);
            
            if (upgradeLevel > 0) {
                this.upgradeTimers[i] += deltaTime;

                const upgradeData = this.gameData.getUpgradeData(i);
                // Use the new timerInterval from the config
                const interval = upgradeData.timerInterval;
                
                this.upgradeViews[i].growAnimation(this.upgradeTimers[i] / interval);

                if (this.upgradeTimers[i] >= interval) {
                    this.gameData.addPassiveScore(upgradeData.baseIncome * upgradeLevel);
                    this.upgradeViews[i].shrinkAnimation();
                    this.upgradeTimers[i] = 0;
                }
            }
        }
    }
    
    private spawnUpgradeViews() {
        const radius = 250;
        const totalUpgrades = this.upgradeConfig.upgrades.length;
        
        for (let i = 0; i < totalUpgrades; i++) {
            const upgradeNode = instantiate(this.upgradePrefab) as Node;
            upgradeNode.setParent(this.upgradeRingParent);
            
            //Positioning upgrade views all around the center
            const angle = (i / totalUpgrades) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            upgradeNode.setPosition(new Vec3(x, y, 0));
            
            const upgradeView = upgradeNode.getComponent(UpgradeView);
            if (upgradeView) {
                const upgradeData = this.upgradeConfig.upgrades[i];
                upgradeView.setup(i, upgradeData.upgradeName, 0, upgradeData.baseCost, upgradeData.upgradeIcon, upgradeData.baseIncome);
                
                this.upgradeViews.push(upgradeView);
                this.upgradeTimers.push(0);
                
                upgradeNode.on(ON_BUY_UPGRADE_REQUEST, this.onUpgradeBuyRequest, this);
            }
        }
    }
    
    private onUpgradeBuyRequest(id: number) {
        if (this.gameData) {
            this.gameData.tryPurchaseUpgrade(id);
        }
    }

    private onScoreChanged(newScore: number) {
        if (!this.gameData) return;
        
        for (let i = 0; i < this.upgradeViews.length; i++) {
            const currentCost = this.gameData.getUpgradeCost(i);
            const currentLevel = this.gameData.getUpgradeLevel(i);
            const canAfford = newScore >= currentCost;
            this.upgradeViews[i].updateView(currentLevel, currentCost, canAfford);
        }
    }
    
    private onUpgradePurchased(id: number) {
        if (this.gameData) {
            this.onScoreChanged(this.gameData.score);
            this.upgradeViews[id].playPurchaseAnimation();
            this.upgradeTimers[id] = 0; 
        }
    }
}