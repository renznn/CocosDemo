// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseComponent from "../common/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Js30 extends BaseComponent {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';



    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        console.log("load js30")
        this.loadResource()
    }

    _initWidget() {

    }


    _onJsonBtnClickEvent(sender) {
        cc.log("click")
        if (sender && sender.node) {
            let name = sender.node.name
            // console.log(sender.node)
            console.log(name)
            console.log((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/'))
            switch (name) {
                case "button":
                    console.log("i have a apple")
                    cc.director.loadScene("/assets/Scene/HallScene")
                    break;
                default: break;
            }

        }
    }

    start() {
        console.log("this is start")
        this.loadResource()
    }

    // update (dt) {}
}
