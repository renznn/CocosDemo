// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseComponent from "../common/BaseComponent";

let SubgameManager = require("../common/SubGameManager")

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hall extends BaseComponent {

    @property(cc.Node)
    hallGameNode: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let name = ["js30", "js60", "js90"]
        for (let i = 0; i < name.length; i++) {
            let node = cc.instantiate(this.hallGameNode)
            node.setPosition(300 * i, 0)

            node.parent = this.hallGameNode.parent;
            let btn = node.getChildByName("button")
            btn.isNeedDownload = false
            btn.isNeedUpdate = false
            btn.name = name[i];

            let btn_pro = btn.getChildByName("progressBar").getComponent(cc.ProgressBar)
            let btn_label = btn.getChildByName("label").getComponent(cc.Label)
            btn_label.node.active = true

            cc.log(name[i])

            //判断子游戏有没有下载
            if (SubgameManager.isSubgameDownLoad(name[i])) {
                //已下载，判断是否需要更新
                SubgameManager.needUpdateSubgame(name[i], (success) => {
                    if (success) {
                        btn.isNeedDownload = true
                        btn_label.string = "游戏需要更新"
                        btn_pro.progress = 1
                        cc.log("子游戏需要更新")
                    } else {
                        btn_pro.progress = 0
                        btn_label.node.active = false
                        cc.log("子游戏不需要更新")
                    }
                }, () => {
                    cc.log('出错了');
                });
            } else {
                btn.isNeedDownload = true
                btn_pro.progress = 1
                btn_label.string = "游戏需要下载"
                cc.log("子游戏未下载")
            }
        }


        this.loadResource()
    }

    _initWidget() {

    }

    _onJsonBtnClickEvent(sender) {
        if (sender && sender.node) {
            let name = sender.node.name
            // console.log(sender.node)
            cc.log(name, sender.node.isNeedDownload, sender.node.isNeedUpdate)

            switch (name) {
                case "js30":
                case "js60":
                case "js90":
                    //download

                    if (sender.node.isNeedDownload || sender.node.isNeedUpdate) {
                        //下载子游戏/更新子游戏
                        SubgameManager.downloadSubgame(name, (progress) => {
                            if (isNaN(progress)) {
                                progress = 0;
                            }
                            let pro = sender.node.getChildByName("progressBar").getComponent(cc.ProgressBar)
                            let label = sender.node.getChildByName("label").getComponent(cc.Label)
                            pro.progress = 1 - progress
                            label.string = "下载中"
                            console.log("资源下载中   " + parseInt(progress * 100 + "") + "%")
                        }, function (success) {
                            if (success) {
                                cc.log("download success")
                                sender.node.getChildByName("label").active = false
                                sender.node.isNeedDownload = false
                                sender.node.isNeedUpdate = false
                                // SubgameManager.enterSubgame('subgame');
                            } else {
                                cc.log('下载失败');
                            }
                        });
                    } else {
                        SubgameManager.enterSubgame(name);
                    }


                    break;
                default:
                    break;
            }

        }
    }



    start() {

    }

    update(dt) { }
}
