import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { GameData, ON_SCORE_CHANGED } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('ClickableCircle')
export class ClickableCircle extends Component {
    @property(Node)
    private gameDataNode: Node | null = null;
    @property(Node)
    private tapArea: Node | null = null; 

    private _gameData: GameData | null = null;
    private _originalScale: Vec3 = new Vec3(1, 1, 1);

    onLoad() {
        this._gameData = this.gameDataNode.getComponent(GameData);
        this._originalScale.set(this.node.getScale());
        this.tapArea.on(Node.EventType.TOUCH_END, this.onTap, this);
    }

    private onTap(): void {
        if (this._gameData) {
            this._gameData.manualClick();
            this.playClickAnimation();
        }
    }

    private playClickAnimation(): void {
        tween(this.node).stop();
        tween(this.node)
            .to(0.1, { scale: new Vec3(this._originalScale.x * 1.2, this._originalScale.y * 1.2, 1) })
            .to(0.1, { scale: this._originalScale })
            .start();
    }
}