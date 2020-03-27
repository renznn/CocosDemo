// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseComponent from "../common/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends BaseComponent {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.ProgressBar)
    processBarItem: cc.ProgressBar = null;

    speed: 1;

    onLoad() {
        this.processBarItem.progress = 0
    }

    start() {

    }

    update(dt) {
        this._updateProgressBar(dt)
    }

    _updateProgressBar(dt) {
        if (this.processBarItem.progress < 1.0) {
            this.processBarItem.progress += Math.random() * 0.2
        }else{
            cc.director.loadScene("LoginScene")
        }
    }
}
