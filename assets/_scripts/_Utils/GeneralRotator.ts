import { _decorator, Component, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GeneralRotator')
export class GeneralRotator extends Component {
    @property({ 
        tooltip: "The speed of rotation in degrees per second." 
    })
    public rotationSpeed: number = 25;

    update(deltaTime: number) {
        this.node.angle += this.rotationSpeed * deltaTime;
    }
}