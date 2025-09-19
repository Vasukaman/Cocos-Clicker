import { _decorator, Component, Node, Label, tween, Vec3, Color } from 'cc';
import { ON_SCORE_CHANGED } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('UIController')
export class UIController extends Component {

    // --- Inspector References ---
    @property(Node)
    private gameDataNode: Node | null = null;

    @property(Label)
    private scoreLabel: Label | null = null;

    @property(Node)
    private clickCircle: Node | null = null;

    // --- Animation Properties ---
    private originalScale: Vec3 = new Vec3(1, 1, 1);

    onLoad() {
        if (this.gameDataNode) {
            // Subscribe to the model's event.
            this.gameDataNode.on(ON_SCORE_CHANGED, this.updateScoreLabel, this);
        }
        if (this.clickCircle) {
            this.originalScale.set(this.clickCircle.getScale());
        }
        
        // Initialize the label on start
        this.updateScoreLabel(0);
    }

    private updateScoreLabel(newScore: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = newScore.toString();
        }
        // When the score updates, also play the visual feedback.
        this.playClickAnimation();
    }

    private playClickAnimation(): void {
        if (!this.clickCircle) return;
        
        // Stop any previous animation to prevent conflicts.
        tween(this.clickCircle).stop();
        
        // Use Cocos's built-in tween system for a smooth, optimized animation.
        tween(this.clickCircle)
            .to(0.1, { scale: new Vec3(this.originalScale.x * 1.2, this.originalScale.y * 1.2, 1) }, { easing: 'quadOut' })
            .to(0.1, { scale: this.originalScale }, { easing: 'quadIn' })
            .start();
    }
}
