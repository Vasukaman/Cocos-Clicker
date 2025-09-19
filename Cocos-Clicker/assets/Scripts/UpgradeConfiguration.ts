import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

// This is a simple data class to hold settings for one type of upgrade.
// The '@property' decorator makes it show up nicely in the inspector.
export class UpgradeData {
    @property
    public baseCost: number = 10;
    @property
    public costMultiplier: number = 1.2;
    @property
    public baseIncomePerSecond: number = 1;
}

@ccclass('UpgradeConfig')
export class UpgradeConfig extends Component {
    // This will be a list of our UpgradeData objects, editable in the inspector.
    @property([UpgradeData])
    public upgrades: UpgradeData[] = [];
}
