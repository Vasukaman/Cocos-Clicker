import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { ON_MANUAL_CLICK_ANIMATION } from '../_Controllers/ClickerController'; // Import the event from the controller
const { ccclass, property } = _decorator;

@ccclass('ClickerCircleView')
export class ClickerCircleView extends Component {

    private _originalScale: Vec3 = new Vec3(1, 1, 1);

    onLoad() {
        this._originalScale.set(this.node.getScale());
        
        // Listen for the event emitted from the same node
        this.node.on(ON_MANUAL_CLICK_ANIMATION, this.playClickAnimation, this);
    }

    private playClickAnimation(): void {
        tween(this.node).stop();
        tween(this.node)
            .to(0.1, { scale: new Vec3(this._originalScale.x * 1.2, this._originalScale.y * 1.2, 1) })
            .to(0.1, { scale: this._originalScale })
            .start();
    }
}