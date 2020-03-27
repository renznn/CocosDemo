// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseComponent from "../common/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends BaseComponent {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Sprite)
    login_panel: cc.Sprite = null

    onLoad() {
        this.loadResource()
        // this.registerAllCustomEvents([["name",this._onJsonBtnClickEvent]])
        // this.unregisterAllCustomEvents()
    }

    start() {

    }

    _initWidget() {
        // cc.log("---init widget")
    }

    _onJsonBtnClickEvent(sender) {
        if (sender && sender.node) {
            let name = sender.node.name
            // cc.log(name)
            switch (name) {
                case "LoginPanelBtnClose":
                    this._isShowLoginPanel(false)
                    break;
                case "ButtonAccountNameClear":
                    break;
                case "ButtonPwdClear":
                    break;
                case "LoginBtnReset":
                    break;
                case "LoginBtnLogin":
                    cc.director.loadScene("HallScene")
                    break;
                case "LoginBtnQuickStart":
                    this._isShowLoginPanel(true)
                    break;
                case "LoginBtnOther":
                    break;
            }
        }

    }

    _isShowLoginPanel(isShow: boolean) {
        if (isShow) {
            this.login_panel.node.active = true
            this.login_panel.node.opacity = 0
            this.login_panel.node.runAction(cc.fadeIn(0.5))
        } else {
            this.login_panel.node.runAction(cc.fadeOut(0.5))
            // this.login_panel.node.active = false
        }
    }


    update(dt) { }
}
