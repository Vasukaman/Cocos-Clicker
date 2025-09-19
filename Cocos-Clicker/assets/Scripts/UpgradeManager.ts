import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { GameData, ON_SCORE_CHANGED, ON_UPGRADE_CHANGED, IUpgradeState } from './GameData';
import { UpgradeView, ON_BUY_UPGRADE_REQUEST } from './UpgradeView';
const { ccclass, property } = _decorator;

@ccclass('UpgradeManager')
export class UpgradeManager extends Component {

    @property(Node)
    private gameDataNode: Node | null = null;
    
    // The prefab for a single upgrade's visuals.
    @property(Prefab)
    private upgradeViewPrefab: Prefab | null = null;

    // The empty node that will contain and rotate the upgrades.
    @property(Node)
    private upgradeContainer: Node | null = null;

    @property
    private rotationSpeed: number = 10;
    
    @property
    private circleRadius: number = 250;

    private _gameData: GameData | null = null;
    private _upgradeViews: UpgradeView[] = [];

    onLoad() {
        if (this.gameDataNode) {
            this._gameData = this.gameDataNode.getComponent(GameData);
            // Listen for changes so we can update our views.
            this.gameDataNode.on(ON_UPGRADE_CHANGED, this.refreshAllViews, this);
            this.gameDataNode.on(ON_SCORE_CHANGED, this.refreshAllViews, this);
        }
    }

    start() {
        this.spawnUpgradeViews();
    }

    update(deltaTime: number) {
        if (this.upgradeContainer) {
            this.upgradeContainer.angle += this.rotationSpeed * deltaTime;
        }
    }

    private spawnUpgradeViews(): void {
        if (!this._gameData || !this.upgradeViewPrefab || !this.upgradeContainer) return;
        
        const upgradeStates = this._gameData.aallUpgradeStates;
        const angleStep = 360 / upgradeStates.length;

        for (let i = 0; i < upgradeStates.length; i++) {
            // Create a new instance from the prefab.
            const newViewNode = instantiate(this.upgradeViewPrefab);
            this.upgradeContainer.addChild(newViewNode);

            // Calculate position on a circle.
            const angle = i * angleStep * (Math.PI / 180); // Convert to radians
            const x = this.circleRadius * Math.cos(angle);
            const y = this.circleRadius * Math.sin(angle);
            newViewNode.setPosition(new Vec3(x, y, 0));

            // Setup the view component.
            const viewComponent = newViewNode.getComponent(UpgradeView);
            if (viewComponent) {
                viewComponent.setup(i);
                this._upgradeViews.push(viewComponent);
                // Listen for this specific view's buy request.
                newViewNode.on(ON_BUY_UPGRADE_REQUEST, this.handleBuyRequest, this);
            }
        }
        this.refreshAllViews();
    }

    private handleBuyRequest(upgradeId: number): void {
        if (this._gameData) {
            this._gameData.tryPurchaseUpgrade(upgradeId);
        }
    }

    private refreshAllViews(): void {
        if (!this._gameData) return;
        const score = this._gameData.score;
        for (let i = 0; i < this._upgradeViews.length; i++) {
            const state = this._gameData.getUpgradeState(i);
            if (state) {
                const canAfford = score >= state.currentCost;
                this._upgradeViews[i].updateView(state.level, state.currentCost, canAfford);
            }
        }
    }
}
