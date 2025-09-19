import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

// Event emitted when the user clicks the buy button on this specific view.
export const ON_BUY_UPGRADE_REQUEST = 'on-buy-upgrade-request';

@ccclass('UpgradeView')
export class UpgradeView extends Component {
    @property(Label)
    private levelLabel: Label | null = null;
    @property(Label)
    private costLabel: Label | null = null;
    @property(Button)
    private buyButton: Button | null = null;

    private _upgradeId: number = -1;

    // The Manager will call this to give this view its identity.
    public setup(id: number): void {
        this._upgradeId = id;
    }

    // The Manager will call this to update the view's data.
    public updateView(level: number, cost: number, canAfford: boolean): void {
        if (this.levelLabel) this.levelLabel.string = `Lvl: ${level}`;
        if (this.costLabel) this.costLabel.string = `Cost: ${cost}`;
        if (this.buyButton) this.buyButton.interactable = canAfford;
    }

    // Called by the button's click event, which we'll wire up in the editor.
    public onBuyButtonClicked(): void {
        // Announce that the user wants to buy this specific upgrade.
        this.node.emit(ON_BUY_UPGRADE_REQUEST, this._upgradeId);
    }
}
