import { _decorator, Component, Label, Button, Node, Sprite, tween, Vec3, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

export const ON_BUY_UPGRADE_REQUEST = 'on-buy-upgrade-request';
export const ON_ADD_SCORE = 'on-add-score';

@ccclass('UpgradeView')
export class UpgradeView extends Component {
    @property(Label)
    private nameLabel: Label | null = null;
    
    @property(Label)
    private levelLabel: Label | null = null;

    @property(Label)
    private costLabel: Label | null = null;
    
    @property(Button)
    private buyButton: Button | null = null;

    @property(Sprite)
    private iconSprite: Sprite | null = null;

    private upgradeId: number = -1;
    private upgradeIncome: number = 0; 
    private originalScale: Vec3 = new Vec3();
     private isVisible: boolean = false;
     

    onLoad() {
        if (this.buyButton) {
            this.buyButton.node.on(Button.EventType.CLICK, this.onBuyClicked, this);
        }
        this.originalScale = this.node.getScale();
        this.node.setScale(Vec3.ZERO);
    }

    public setup(id: number, name: string, level: number, cost: number, icon: SpriteFrame | null, income: number) {
        this.upgradeId = id;
        this.upgradeIncome = income; 
        
        if (this.nameLabel) {
            this.nameLabel.string = name;
        }

        if (this.iconSprite && icon) {
            this.iconSprite.spriteFrame = icon;
        }
        
        if (this.buyButton) {
             const costLabel = this.buyButton.getComponentInChildren(Label);
             if (costLabel) {
                 this.costLabel = costLabel;
             }
        }
        
        this.updateView(level, cost, false);
    }
    
    public updateView(level: number, newCost: number, canAfford: boolean) {
       
        const shouldBeVisible = level > 0 || canAfford;

        if (shouldBeVisible && !this.isVisible) {
            this.onVisible();
        } else 
        if (!shouldBeVisible && this.isVisible)
        {
            this.onInvisible();
        }

        if (this.levelLabel) {
            this.levelLabel.string = `Lvl: ${level}`;
        }
        if (this.costLabel) {
            this.costLabel.string = `$${newCost}`;
        }

        if (this.buyButton) {
            this.buyButton.interactable = canAfford;
        }
    }
    
    private onVisible() {
        this.isVisible = true;
        tween(this.node).stop();
        tween(this.node).to(0.3, { scale: this.originalScale }, { easing: 'backOut' }).start();
    }

    private onInvisible() {
        this.isVisible = false;
        tween(this.node).stop();
        tween(this.node).to(0.3, { scale: Vec3.ZERO }, { easing: 'backOut' }).start();
    }

     public playPurchaseAnimation() {
        tween(this.node).stop();
        tween(this.node)
            .to(0.1, { scale: this.originalScale.clone().multiplyScalar(1.5) })
            .to(0.1, { scale: this.originalScale })
            .start();
    }

    private onBuyClicked() {
        this.node.emit(ON_BUY_UPGRADE_REQUEST, this.upgradeId);
    }

     public growAnimation(progress: number) {
        const scale = this.originalScale.clone().multiplyScalar(1 + 0.5 * progress);
        this.node.setScale(scale);
    }

    //Makes updateView always be right side up.
    public updateGlobalRotation(parentRotation: number) {
        this.node.angle = -parentRotation;
    }
    // A quick shrink and back to original size.
    public shrinkAnimation() {
        tween(this.node).stop();
        tween(this.node)
            .to(0.1, { scale: this.originalScale.clone().multiplyScalar(0.8) })
            .to(0.1, { scale: this.originalScale })
            .start();
    }
}