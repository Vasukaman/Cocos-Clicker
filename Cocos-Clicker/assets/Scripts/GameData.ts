import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// This is a custom event name we'll use for communication.
export const ON_SCORE_CHANGED = 'on-score-changed';

@ccclass('GameData')
export class GameData extends Component {
    
    private _score: number = 0;
    
    public get score(): number {
        return this._score;
    }

    // This is the public method our InputController will call.
    public incrementScore(): void {
        this._score++;
        // Emit a global event on this node, passing the new score as data.
        // This is like invoking a C# event or a UnityEvent.
        this.node.emit(ON_SCORE_CHANGED, this._score);
    }
}
