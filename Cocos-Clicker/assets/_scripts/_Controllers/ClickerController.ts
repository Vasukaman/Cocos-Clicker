import { _decorator, Component, Node } from 'cc';
import { GameData } from '../_Data/GameData';
const { ccclass, property } = _decorator;

export const ON_MANUAL_CLICK_ANIMATION = 'on-manual-click-animation';

@ccclass('ClickerController')
export class ClickerController extends Component {

    @property(GameData)
    private gameData: GameData | null = null;
    
    @property(Node)
    private tapArea: Node | null = null; 

    onLoad() {
        if (this.tapArea) {
            this.tapArea.on(Node.EventType.TOUCH_END, this.onTap, this);
        }
    }

    private onTap(): void {
        if (this.gameData) {
            // Tell the model to update the score
            this.gameData.manualClick();
            
            // Emit an event for the view on the same node to listen to
            this.node.emit(ON_MANUAL_CLICK_ANIMATION);
        }
    }
}