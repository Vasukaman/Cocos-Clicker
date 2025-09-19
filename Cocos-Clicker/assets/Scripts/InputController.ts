import { _decorator, Component, Node, EventTouch } from 'cc';
import { GameData } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('InputController')
export class InputController extends Component {

    // Reference to the node that holds our GameData model.
    @property(Node)
    private gameDataNode: Node | null = null;

    // Reference to the area that detects clicks.
    @property(Node)
    private tapArea: Node | null = null;

    private _gameData: GameData | null = null;

    onLoad() {
        if (this.gameDataNode) {
            this._gameData = this.gameDataNode.getComponent(GameData);
        }

        if (this.tapArea) {
            // Listen for the TOUCH_END event (equivalent to a click).
            this.tapArea.on(Node.EventType.TOUCH_END, this.onTap, this);
        }
    }

    private onTap(event: EventTouch): void {
        // When a tap occurs, tell the model to increment the score.
        // This script doesn't know or care what happens after this.
        if (this._gameData) {
            this._gameData.incrementScore();
        }
    }
}
