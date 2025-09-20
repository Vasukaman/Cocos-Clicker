import { _decorator, Component, Label, Node } from 'cc';
import { ON_SCORE_CHANGED } from './GameData';
const { ccclass, property } = _decorator;

@ccclass('ScoreLabelView')
export class ScoreLabelView extends Component {
    @property(Node)
    private gameDataNode: Node | null = null;

    private _label: Label | null = null;

    onLoad() {
        this._label = this.getComponent(Label);
        this.gameDataNode.on(ON_SCORE_CHANGED, this.onScoreUpdate, this);
        this.onScoreUpdate(0); 
    }

    private onScoreUpdate(newScore: number): void {
        this._label.string = Math.floor(newScore).toString();
    }
}