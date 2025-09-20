import { _decorator, Component, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('UpgradeData')
export class UpgradeData {
    @property
    public upgradeName: string = '';
    @property(SpriteFrame)
    public upgradeIcon: SpriteFrame | null = null;
    @property({ 
        tooltip: "The time in seconds it takes to generate income." 
    })
    public timerInterval: number = 1;
    @property
    public baseCost: number = 10;
    @property
    public baseIncome: number = 1;
}

@ccclass('UpgradeConfig')
export class UpgradeConfig extends Component {
    @property([UpgradeData])
    public upgrades: UpgradeData[] = [];
}